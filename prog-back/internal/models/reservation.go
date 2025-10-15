package models

import "time"

type Reservation struct {
	ID                 uint      `gorm:"primaryKey" json:"id"`
	RoomID             uint      `gorm:"index;not null" json:"room_id"`
	Room               *Room     `gorm:"foreignKey:RoomID" json:"room,omitempty"`
	UserID             uint      `gorm:"index;not null" json:"user_id"`
	User               *User     `gorm:"foreignKey:UserID" json:"user,omitempty"`
	ClassID            *uint     `gorm:"index" json:"class_id,omitempty"`
	Class              *Class    `gorm:"foreignKey:ClassID" json:"class,omitempty"`
	StartTime          time.Time `gorm:"not null;index" json:"start_time"`
	EndTime            time.Time `gorm:"not null;index" json:"end_time"`
	Purpose            string    `json:"purpose"`
	EstimatedAttendees int       `json:"estimated_attendees"`
	Status             string    `gorm:"not null;default:'ACTIVE'" json:"status"` // ACTIVE|CANCELLED
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}
