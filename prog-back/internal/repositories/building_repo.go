package repositories

import (
	"programcion-backend/internal/models"
	"programcion-backend/pkg/db"
)

type BuildingRepository struct{}

func NewBuildingRepository() *BuildingRepository { return &BuildingRepository{} }

func (r *BuildingRepository) Create(b *models.Building) error {
	return db.GetDB().Create(b).Error
}

func (r *BuildingRepository) GetAll() ([]models.Building, error) {
	var list []models.Building
	if err := db.GetDB().Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *BuildingRepository) GetByID(id uint) (*models.Building, error) {
	var b models.Building
	if err := db.GetDB().First(&b, id).Error; err != nil {
		return nil, err
	}
	return &b, nil
}

func (r *BuildingRepository) Update(b *models.Building) error { return db.GetDB().Save(b).Error }

func (r *BuildingRepository) Delete(id uint) error {
	return db.GetDB().Delete(&models.Building{}, id).Error
}
