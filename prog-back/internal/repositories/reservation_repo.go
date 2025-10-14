package repositories

import (
	"time"

	"programcion-backend/internal/models"
	"programcion-backend/pkg/db"
)

type ReservationRepository struct{}

func NewReservationRepository() *ReservationRepository { return &ReservationRepository{} }

func (r *ReservationRepository) Create(resv *models.Reservation) error {
	return db.GetDB().Create(resv).Error
}

func (r *ReservationRepository) GetByID(id uint) (*models.Reservation, error) {
	var rsv models.Reservation
	if err := db.GetDB().First(&rsv, id).Error; err != nil {
		return nil, err
	}
	return &rsv, nil
}

func (r *ReservationRepository) List(filter map[string]interface{}, from, to *time.Time) ([]models.Reservation, error) {
	var list []models.Reservation
	q := db.GetDB().Model(&models.Reservation{})
	for k, v := range filter {
		q = q.Where(k+" = ?", v)
	}
	if from != nil {
		q = q.Where("start_time >= ?", *from)
	}
	if to != nil {
		q = q.Where("end_time <= ?", *to)
	}
	if err := q.Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *ReservationRepository) HasOverlapping(roomID uint, start, end time.Time) (bool, error) {
	var count int64
	db.GetDB().Model(&models.Reservation{}).
		Where("room_id = ? AND status = ? AND start_time < ? AND end_time > ?", roomID, "ACTIVE", end, start).
		Count(&count)
	return count > 0, nil
}

func (r *ReservationRepository) Delete(id uint) error {
	return db.GetDB().Delete(&models.Reservation{}, id).Error
}

func (r *ReservationRepository) Update(resv *models.Reservation) error {
	return db.GetDB().Save(resv).Error
}
