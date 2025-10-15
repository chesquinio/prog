package controllers

import (
	"net/http"
	"strconv"

	"programcion-backend/internal/services"

	"github.com/gin-gonic/gin"
)

var userService = services.NewUserService()

func ListUsers(c *gin.Context) {
	role := c.Query("role")
	isConfirmedStr := c.Query("is_confirmed")

	var isConfirmed *bool
	if isConfirmedStr != "" {
		val := isConfirmedStr == "true"
		isConfirmed = &val
	}

	users, err := userService.GetUsersWithFilters(role, isConfirmed)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, users)
}

func GetUser(c *gin.Context) {
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

	// Solo ADMIN o el propio usuario pueden ver el detalle
	if roleStr != "ADMIN" && uid != uint(id) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized"})
		return
	}

	user, err := userService.GetUserByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}
