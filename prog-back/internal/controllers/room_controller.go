package controllers

import (
	"net/http"
	"strconv"

	"programcion-backend/internal/models"
	"programcion-backend/internal/services"

	"github.com/gin-gonic/gin"
)

var roomService = services.NewRoomService()

func CreateRoom(c *gin.Context) {
	var r models.Room
	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := roomService.Create(&r); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, r)
}

func ListRooms(c *gin.Context) {
	list, err := roomService.List(0) // Sin filtro de edificio
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, list)
}

func GetRoom(c *gin.Context) {
	idStr := c.Param("id")
	id64, _ := strconv.ParseUint(idStr, 10, 32)
	r, err := roomService.Get(uint(id64))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusOK, r)
}

func UpdateRoom(c *gin.Context) {
	idStr := c.Param("id")
	id64, _ := strconv.ParseUint(idStr, 10, 32)
	var payload models.Room
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	payload.ID = uint(id64)
	if err := roomService.Update(&payload); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, payload)
}

func DeleteRoom(c *gin.Context) {
	idStr := c.Param("id")
	id64, _ := strconv.ParseUint(idStr, 10, 32)
	if err := roomService.Delete(uint(id64)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "deleted"})
}
