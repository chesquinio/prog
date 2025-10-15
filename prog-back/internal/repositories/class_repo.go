package repositories

import (
	"programcion-backend/internal/models"
	"programcion-backend/pkg/db"
)

type ClassRepository struct{}

func NewClassRepository() *ClassRepository {
	return &ClassRepository{}
}

func (r *ClassRepository) Create(class *models.Class) error {
	return db.GetDB().Create(class).Error
}

func (r *ClassRepository) FindByID(id uint) (*models.Class, error) {
	var class models.Class
	err := db.GetDB().Preload("Professor").Preload("Students").First(&class, id).Error
	return &class, err
}

func (r *ClassRepository) FindByProfessorID(professorID uint) ([]models.Class, error) {
	var classes []models.Class
	err := db.GetDB().Where("professor_id = ?", professorID).Preload("Professor").Preload("Students").Find(&classes).Error
	return classes, err
}

func (r *ClassRepository) FindAll() ([]models.Class, error) {
	var classes []models.Class
	err := db.GetDB().Preload("Professor").Find(&classes).Error
	return classes, err
}

func (r *ClassRepository) Update(class *models.Class) error {
	return db.GetDB().Save(class).Error
}

func (r *ClassRepository) Delete(id uint) error {
	return db.GetDB().Delete(&models.Class{}, id).Error
}

func (r *ClassRepository) AddStudent(classID, studentID uint) error {
	return db.GetDB().Exec(
		"INSERT INTO class_students (class_id, student_id) VALUES (?, ?) ON CONFLICT DO NOTHING",
		classID, studentID,
	).Error
}

func (r *ClassRepository) RemoveStudent(classID, studentID uint) error {
	return db.GetDB().Exec(
		"DELETE FROM class_students WHERE class_id = ? AND student_id = ?",
		classID, studentID,
	).Error
}

func (r *ClassRepository) GetStudents(classID uint) ([]models.User, error) {
	var students []models.User
	err := db.GetDB().
		Joins("JOIN class_students ON users.id = class_students.student_id").
		Where("class_students.class_id = ?", classID).
		Find(&students).Error
	return students, err
}

func (r *ClassRepository) FindClassesByStudentID(studentID uint) ([]models.Class, error) {
	var classes []models.Class
	err := db.GetDB().
		Joins("JOIN class_students ON classes.id = class_students.class_id").
		Where("class_students.student_id = ?", studentID).
		Preload("Professor").
		Find(&classes).Error
	return classes, err
}
