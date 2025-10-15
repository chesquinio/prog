package controllers

import (
	"net/http"
	"strconv"
	"time"

	"programcion-backend/internal/models"
	"programcion-backend/internal/services"

	"github.com/gin-gonic/gin"
)

var reservationService = services.NewReservationService()

type createReservationReq struct {
	RoomID             uint   `json:"room_id" binding:"required"`
	ClassID            *uint  `json:"class_id"`
	StartTime          string `json:"start_time" binding:"required"` // RFC3339
	EndTime            string `json:"end_time" binding:"required"`
	Purpose            string `json:"purpose"`
	EstimatedAttendees int    `json:"estimated_attendees"`
}

func CreateReservation(c *gin.Context) {
	var req createReservationReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	st, err := time.Parse(time.RFC3339, req.StartTime)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid start_time format"})
		return
	}
	et, err := time.Parse(time.RFC3339, req.EndTime)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid end_time format"})
		return
	}

	// get user from context
	uidI, _ := c.Get("user_id")
	var uid uint
	if v, ok := uidI.(uint); ok {
		uid = v
	}

	resv := &models.Reservation{
		RoomID:             req.RoomID,
		UserID:             uid,
		ClassID:            req.ClassID,
		StartTime:          st,
		EndTime:            et,
		Purpose:            req.Purpose,
		EstimatedAttendees: req.EstimatedAttendees,
	}
	if err := reservationService.Create(resv); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, resv)
}

func ListReservations(c *gin.Context) {
	// parse optional filters
	var filter = make(map[string]interface{})
	if room := c.Query("room_id"); room != "" {
		if id, err := strconv.ParseUint(room, 10, 32); err == nil {
			filter["room_id"] = uint(id)
		}
	}
	if user := c.Query("user_id"); user != "" {
		if id, err := strconv.ParseUint(user, 10, 32); err == nil {
			filter["user_id"] = uint(id)
		}
	}
	var from, to *time.Time
	if f := c.Query("date_from"); f != "" {
		if t, err := time.Parse(time.RFC3339, f); err == nil {
			from = &t
		}
	}
	if t := c.Query("date_to"); t != "" {
		if tt, err := time.Parse(time.RFC3339, t); err == nil {
			to = &tt
		}
	}
	list, err := reservationService.List(filter, from, to)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, list)
}

func GetReservation(c *gin.Context) {
	idStr := c.Param("id")
	id64, _ := strconv.ParseUint(idStr, 10, 32)
	r, err := reservationService.Get(uint(id64))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusOK, r)
}

func CancelReservation(c *gin.Context) {
	idStr := c.Param("id")
	id64, _ := strconv.ParseUint(idStr, 10, 32)
	if err := reservationService.Cancel(uint(id64)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "cancelled"})
}
