package services

import (
	"programcion-backend/internal/models"
	"programcion-backend/internal/repositories"
)

type BuildingService struct {
	repo *repositories.BuildingRepository
}

func NewBuildingService() *BuildingService {
	return &BuildingService{repo: repositories.NewBuildingRepository()}
}

func (s *BuildingService) Create(b *models.Building) error       { return s.repo.Create(b) }
func (s *BuildingService) List() ([]models.Building, error)      { return s.repo.GetAll() }
func (s *BuildingService) Get(id uint) (*models.Building, error) { return s.repo.GetByID(id) }
func (s *BuildingService) Update(b *models.Building) error       { return s.repo.Update(b) }
func (s *BuildingService) Delete(id uint) error                  { return s.repo.Delete(id) }
