package services

import (
	"programcion-backend/internal/models"
	"programcion-backend/internal/repositories"
)

type RoomService struct{ repo *repositories.RoomRepository }

func NewRoomService() *RoomService { return &RoomService{repo: repositories.NewRoomRepository()} }

func (s *RoomService) Create(rm *models.Room) error      { return s.repo.Create(rm) }
func (s *RoomService) List() ([]models.Room, error)      { return s.repo.GetAll() }
func (s *RoomService) Get(id uint) (*models.Room, error) { return s.repo.GetByID(id) }
func (s *RoomService) Update(rm *models.Room) error      { return s.repo.Update(rm) }
func (s *RoomService) Delete(id uint) error              { return s.repo.Delete(id) }
