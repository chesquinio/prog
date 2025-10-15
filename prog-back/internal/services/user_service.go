package services

import (
	"programcion-backend/internal/models"
	"programcion-backend/internal/repositories"
)

type UserService struct {
	repo *repositories.UserRepository
}

func NewUserService() *UserService {
	return &UserService{
		repo: repositories.NewUserRepository(),
	}
}

func (s *UserService) GetUsersWithFilters(role string, isConfirmed *bool) ([]models.User, error) {
	return s.repo.FindWithFilters(role, isConfirmed)
}

func (s *UserService) GetUserByID(id uint) (*models.User, error) {
	return s.repo.GetByID(id)
}
