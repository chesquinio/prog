package models

import "time"

type Reservation struct {
	ID                 uint      `gorm:"primaryKey" json:"id"`
	RoomID             uint      `gorm:"index;not null" json:"room_id"`
	UserID             uint      `gorm:"index;not null" json:"user_id"`
	StartTime          time.Time `gorm:"not null;index" json:"start_time"`
	EndTime            time.Time `gorm:"not null;index" json:"end_time"`
	Purpose            string    `json:"purpose"`
	EstimatedAttendees int       `json:"estimated_attendees"`
	Status             string    `gorm:"not null;default:'ACTIVE'" json:"status"` // ACTIVE|CANCELLED
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}
