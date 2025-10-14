package controllers

import (
	"net/http"
	"strconv"

	"programcion-backend/internal/models"
	"programcion-backend/internal/services"

	"github.com/gin-gonic/gin"
)

var buildingService = services.NewBuildingService()

func CreateBuilding(c *gin.Context) {
	var b models.Building
	if err := c.ShouldBindJSON(&b); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := buildingService.Create(&b); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, b)
}

func ListBuildings(c *gin.Context) {
	list, err := buildingService.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, list)
}

func GetBuilding(c *gin.Context) {
	idStr := c.Param("id")
	id64, _ := strconv.ParseUint(idStr, 10, 32)
	b, err := buildingService.Get(uint(id64))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusOK, b)
}
