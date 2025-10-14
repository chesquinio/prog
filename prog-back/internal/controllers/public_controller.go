package controllers

import (
	"net/http"

	"programcion-backend/pkg/db"

	"github.com/gin-gonic/gin"
)

type PublicReservationResp struct {
	ID                 uint   `json:"id"`
	RoomID             uint   `json:"room_id"`
	RoomName           string `json:"room_name"`
	BuildingID         uint   `json:"building_id"`
	BuildingName       string `json:"building_name"`
	UserID             uint   `json:"user_id"`
	UserName           string `json:"user_name"`
	UserEmail          string `json:"user_email"`
	StartTime          string `json:"start_time"`
	EndTime            string `json:"end_time"`
	Purpose            string `json:"purpose"`
	EstimatedAttendees int    `json:"estimated_attendees"`
	Status             string `json:"status"`
}

func GetPublicReservations(c *gin.Context) {
	// Simple join query to gather reservation + room + building + user
	rows, err := db.GetDB().Raw(`
        SELECT r.id, r.room_id, rm.name as room_name, rm.building_id, b.name as building_name,
               r.user_id, u.name as user_name, u.email as user_email,
               r.start_time::text as start_time, r.end_time::text as end_time,
               r.purpose, r.estimated_attendees, r.status
        FROM reservations r
        JOIN rooms rm ON rm.id = r.room_id
        JOIN buildings b ON b.id = rm.building_id
        LEFT JOIN users u ON u.id = r.user_id
        WHERE r.status = 'ACTIVE'
        ORDER BY r.start_time ASC
    `).Rows()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()
	var out []PublicReservationResp
	for rows.Next() {
		var r PublicReservationResp
		if err := rows.Scan(&r.ID, &r.RoomID, &r.RoomName, &r.BuildingID, &r.BuildingName, &r.UserID, &r.UserName, &r.UserEmail, &r.StartTime, &r.EndTime, &r.Purpose, &r.EstimatedAttendees, &r.Status); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		out = append(out, r)
	}
	c.JSON(http.StatusOK, out)
}
