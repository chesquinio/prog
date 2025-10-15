package controllers

import (
	"net/http"
	"strconv"

	"programcion-backend/internal/services"

	"github.com/gin-gonic/gin"
)

var classService = services.NewClassService()

type createClassReq struct {
	Name        string `json:"name" binding:"required,min=3"`
	Description string `json:"description"`
	Subject     string `json:"subject" binding:"required,min=2"`
}

func CreateClass(c *gin.Context) {
	var req createClassReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "missing user"})
		return
	}
	professorID := userID.(uint)

	class, err := classService.CreateClass(req.Name, req.Description, req.Subject, professorID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, class)
}

func ListClasses(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "missing user"})
		return
	}
	role, _ := c.Get("role")
	
	uid := userID.(uint)
	roleStr, _ := role.(string)

	professorIDParam := c.Query("professor_id")

	var classes []interface{}

	if roleStr == "PROFESSOR" {
		// Si es profesor, mostrar solo sus clases (a menos que sea ADMIN y especifique otro profesor)
		if professorIDParam != "" && roleStr == "ADMIN" {
			pid, _ := strconv.ParseUint(professorIDParam, 10, 32)
			result, err := classService.GetClassesByProfessor(uint(pid))
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			for _, cls := range result {
				classes = append(classes, cls)
			}
		} else {
			result, err := classService.GetClassesByProfessor(uid)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			for _, cls := range result {
				classes = append(classes, cls)
			}
		}
	} else if roleStr == "ADMIN" {
		// Admin puede ver todas o filtrar por profesor
		if professorIDParam != "" {
			pid, _ := strconv.ParseUint(professorIDParam, 10, 32)
			result, err := classService.GetClassesByProfessor(uint(pid))
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			for _, cls := range result {
				classes = append(classes, cls)
			}
		} else {
			result, err := classService.GetAllClasses()
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			for _, cls := range result {
				classes = append(classes, cls)
			}
		}
	} else if roleStr == "STUDENT" {
		// Estudiante: ver clases donde está inscrito
		result, err := classService.GetClassesByStudent(uid)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		for _, cls := range result {
			classes = append(classes, cls)
		}
	}

	c.JSON(http.StatusOK, classes)
}

func GetClass(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	class, err := classService.GetClass(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Class not found"})
		return
	}

	c.JSON(http.StatusOK, class)
}

type updateClassReq struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Subject     string `json:"subject"`
}

func UpdateClass(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "missing user"})
		return
	}
	uid := userID.(uint)
	role, _ := c.Get("role")
	roleStr, _ := role.(string)

	// Verificar ownership si no es admin
	if roleStr != "ADMIN" {
		isOwner, err := classService.IsOwner(uint(id), uid)
		if err != nil || !isOwner {
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized"})
			return
		}
	}

	var req updateClassReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	class, err := classService.UpdateClass(uint(id), req.Name, req.Description, req.Subject)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, class)
}

func DeleteClass(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "missing user"})
		return
	}
	uid := userID.(uint)
	role, _ := c.Get("role")
	roleStr, _ := role.(string)

	// Verificar ownership si no es admin
	if roleStr != "ADMIN" {
		isOwner, err := classService.IsOwner(uint(id), uid)
		if err != nil || !isOwner {
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized"})
			return
		}
	}

	if err := classService.DeleteClass(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

type addStudentReq struct {
	StudentID uint `json:"student_id" binding:"required"`
}

func AddStudent(c *gin.Context) {
	idStr := c.Param("id")
	classID, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid class id"})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "missing user"})
		return
	}
	uid := userID.(uint)
	role, _ := c.Get("role")
	roleStr, _ := role.(string)

	// Verificar ownership si no es admin
	if roleStr != "ADMIN" {
		isOwner, err := classService.IsOwner(uint(classID), uid)
		if err != nil || !isOwner {
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized"})
			return
		}
	}

	var req addStudentReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := classService.AddStudent(uint(classID), req.StudentID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "Student added to class",
		"class_id":   classID,
		"student_id": req.StudentID,
	})
}

func RemoveStudent(c *gin.Context) {
	idStr := c.Param("id")
	classID, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid class id"})
		return
	}

	studentIDStr := c.Param("student_id")
	studentID, err := strconv.ParseUint(studentIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid student id"})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "missing user"})
		return
	}
	uid := userID.(uint)
	role, _ := c.Get("role")
	roleStr, _ := role.(string)

	// Verificar ownership si no es admin
	if roleStr != "ADMIN" {
		isOwner, err := classService.IsOwner(uint(classID), uid)
		if err != nil || !isOwner {
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized"})
			return
		}
	}

	if err := classService.RemoveStudent(uint(classID), uint(studentID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Student removed from class"})
}

func ListClassStudents(c *gin.Context) {
	idStr := c.Param("id")
	classID, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid class id"})
		return
	}

	students, err := classService.GetClassStudents(uint(classID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, students)
}
