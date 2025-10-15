package services

import (
	"programcion-backend/internal/models"
	"programcion-backend/internal/repositories"
)

type BuildingService struct {
	repo *repositories.BuildingRepository
}

func NewBuildingService() *BuildingService {
	return &BuildingService{
		repo: repositories.NewBuildingRepository(),
	}
}

func (s *BuildingService) Create(building *models.Building) error {
	return s.repo.Create(building)
}

func (s *BuildingService) List() ([]models.Building, error) {
	return s.repo.GetAll()
}

func (s *BuildingService) Get(id uint) (*models.Building, error) {
	return s.repo.GetByID(id)
}
