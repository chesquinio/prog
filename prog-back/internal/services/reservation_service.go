package services

import (
	"errors"
	"time"

	"programcion-backend/internal/models"
	"programcion-backend/internal/repositories"
)

type ReservationService struct {
	repo     *repositories.ReservationRepository
	roomRepo *repositories.RoomRepository
}

func NewReservationService() *ReservationService {
	return &ReservationService{
		repo:     repositories.NewReservationRepository(),
		roomRepo: repositories.NewRoomRepository(),
	}
}

func (s *ReservationService) Create(resv *models.Reservation) error {
	// Validaciones: no solapamiento y capacidad
	overlaps, err := s.repo.HasOverlapping(resv.RoomID, resv.StartTime, resv.EndTime)
	if err != nil {
		return err
	}
	if overlaps {
		return errors.New("time slot not available (overlap)")
	}

	// Verificar capacidad del aula
	room, err := s.roomRepo.GetByID(resv.RoomID)
	if err != nil {
		return errors.New("room not found")
	}
	if resv.EstimatedAttendees > room.Capacity {
		return errors.New("estimated attendees exceeds room capacity")
	}

	resv.Status = "ACTIVE"
	return s.repo.Create(resv)
}

func (s *ReservationService) List(filter map[string]interface{}, from, to *time.Time) ([]models.Reservation, error) {
	return s.repo.List(filter, from, to)
}

func (s *ReservationService) Get(id uint) (*models.Reservation, error) {
	return s.repo.GetByID(id)
}

func (s *ReservationService) Cancel(id uint) error {
	resv, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}
	resv.Status = "CANCELLED"
	return s.repo.Update(resv)
}
