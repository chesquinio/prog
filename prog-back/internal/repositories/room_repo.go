package repositories

import (
	"programcion-backend/internal/models"
	"programcion-backend/pkg/db"
)

type RoomRepository struct{}

func NewRoomRepository() *RoomRepository { return &RoomRepository{} }

func (r *RoomRepository) Create(room *models.Room) error { return db.GetDB().Create(room).Error }

func (r *RoomRepository) GetAll() ([]models.Room, error) {
	var list []models.Room
	if err := db.GetDB().Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *RoomRepository) GetByID(id uint) (*models.Room, error) {
	var m models.Room
	if err := db.GetDB().First(&m, id).Error; err != nil {
		return nil, err
	}
	return &m, nil
}

func (r *RoomRepository) Update(room *models.Room) error { return db.GetDB().Save(room).Error }

func (r *RoomRepository) Delete(id uint) error { return db.GetDB().Delete(&models.Room{}, id).Error }
