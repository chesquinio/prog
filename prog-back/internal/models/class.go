package models

import (
	"time"

	"gorm.io/gorm"
)

type Class struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Name        string         `gorm:"not null" json:"name"`
	Description string         `json:"description"`
	Subject     string         `json:"subject"`
	ProfessorID uint           `gorm:"not null" json:"professor_id"`
	Professor   *User          `gorm:"foreignKey:ProfessorID" json:"professor,omitempty"`
	Students    []User         `gorm:"many2many:class_students;" json:"students,omitempty"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

type ClassStudent struct {
	ClassID    uint      `gorm:"primaryKey" json:"class_id"`
	StudentID  uint      `gorm:"primaryKey" json:"student_id"`
	EnrolledAt time.Time `gorm:"autoCreateTime" json:"enrolled_at"`
}
