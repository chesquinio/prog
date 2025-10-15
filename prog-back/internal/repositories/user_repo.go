package repositories

import (
	"programcion-backend/internal/models"
	"programcion-backend/pkg/db"
)

type UserRepository struct{}

func NewUserRepository() *UserRepository { return &UserRepository{} }

func (r *UserRepository) Create(user *models.User) error {
	return db.GetDB().Create(user).Error
}

func (r *UserRepository) GetByEmail(email string) (*models.User, error) {
	var u models.User
	if err := db.GetDB().Where("email = ?", email).First(&u).Error; err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *UserRepository) GetByID(id uint) (*models.User, error) {
	var u models.User
	if err := db.GetDB().First(&u, id).Error; err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *UserRepository) Update(user *models.User) error {
	return db.GetDB().Save(user).Error
}

func (r *UserRepository) FindWithFilters(role string, isConfirmed *bool) ([]models.User, error) {
	query := db.GetDB().Model(&models.User{})

	if role != "" {
		query = query.Where("role = ?", role)
	}

	if isConfirmed != nil {
		query = query.Where("is_confirmed = ?", *isConfirmed)
	}

	var users []models.User
	err := query.Find(&users).Error
	return users, err
}
