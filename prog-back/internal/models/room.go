package models

import "time"

type Room struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	BuildingID  uint      `gorm:"index;not null" json:"building_id"`
	Building    *Building `gorm:"foreignKey:BuildingID" json:"building,omitempty"`
	Name        string    `gorm:"not null" json:"name"`
	Capacity    int       `gorm:"not null" json:"capacity"`
	Resources   string    `json:"resources"` // JSON string or comma-separated
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
