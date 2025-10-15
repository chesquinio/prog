package services

import (
	"programcion-backend/internal/models"
	"programcion-backend/internal/repositories"
)

type RoomService struct {
	repo *repositories.RoomRepository
}

func NewRoomService() *RoomService {
	return &RoomService{
		repo: repositories.NewRoomRepository(),
	}
}

func (s *RoomService) Create(room *models.Room) error {
	return s.repo.Create(room)
}

func (s *RoomService) List(buildingID uint) ([]models.Room, error) {
	// El repositorio actual no tiene filtro por buildingID, retornar todos
	return s.repo.GetAll()
}

func (s *RoomService) Get(id uint) (*models.Room, error) {
	return s.repo.GetByID(id)
}

func (s *RoomService) Update(room *models.Room) error {
	return s.repo.Update(room)
}

func (s *RoomService) Delete(id uint) error {
	return s.repo.Delete(id)
}
