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
	return &ReservationService{repo: repositories.NewReservationRepository(), roomRepo: repositories.NewRoomRepository()}
}

func (s *ReservationService) Create(resv *models.Reservation) error {
	// validate capacity
	room, err := s.roomRepo.GetByID(resv.RoomID)
	if err != nil {
		return err
	}
	if resv.EstimatedAttendees > room.Capacity {
		return errors.New("estimated attendees exceed room capacity")
	}
	// validate times
	if !resv.StartTime.Before(resv.EndTime) {
		return errors.New("start_time must be before end_time")
	}
	// overlapping
	overlap, err := s.repo.HasOverlapping(resv.RoomID, resv.StartTime, resv.EndTime)
	if err != nil {
		return err
	}
	if overlap {
		return errors.New("time slot overlaps with existing reservation")
	}

	resv.Status = "ACTIVE"
	resv.CreatedAt = time.Now()
	resv.UpdatedAt = time.Now()
	return s.repo.Create(resv)
}

func (s *ReservationService) Get(id uint) (*models.Reservation, error) { return s.repo.GetByID(id) }
func (s *ReservationService) List(filter map[string]interface{}, from, to *time.Time) ([]models.Reservation, error) {
	return s.repo.List(filter, from, to)
}
func (s *ReservationService) Cancel(id uint) error {
	r, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}
	r.Status = "CANCELLED"
	r.UpdatedAt = time.Now()
	return s.repo.Update(r)
}
