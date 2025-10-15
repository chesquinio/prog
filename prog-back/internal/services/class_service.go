package services

import (
	"errors"
	"programcion-backend/internal/models"
	"programcion-backend/internal/repositories"
)

type ClassService struct {
	repo     *repositories.ClassRepository
	userRepo *repositories.UserRepository
}

func NewClassService() *ClassService {
	return &ClassService{
		repo:     repositories.NewClassRepository(),
		userRepo: repositories.NewUserRepository(),
	}
}

func (s *ClassService) CreateClass(name, description, subject string, professorID uint) (*models.Class, error) {
	class := &models.Class{
		Name:        name,
		Description: description,
		Subject:     subject,
		ProfessorID: professorID,
	}
	if err := s.repo.Create(class); err != nil {
		return nil, err
	}
	// Recargar con profesor incluido
	return s.repo.FindByID(class.ID)
}

func (s *ClassService) GetClass(id uint) (*models.Class, error) {
	return s.repo.FindByID(id)
}

func (s *ClassService) GetClassesByProfessor(professorID uint) ([]models.Class, error) {
	return s.repo.FindByProfessorID(professorID)
}

func (s *ClassService) GetClassesByStudent(studentID uint) ([]models.Class, error) {
	return s.repo.FindClassesByStudentID(studentID)
}

func (s *ClassService) GetAllClasses() ([]models.Class, error) {
	return s.repo.FindAll()
}

func (s *ClassService) UpdateClass(id uint, name, description, subject string) (*models.Class, error) {
	class, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	if name != "" {
		class.Name = name
	}
	if description != "" {
		class.Description = description
	}
	if subject != "" {
		class.Subject = subject
	}

	if err := s.repo.Update(class); err != nil {
		return nil, err
	}

	return class, nil
}

func (s *ClassService) DeleteClass(id uint) error {
	return s.repo.Delete(id)
}

func (s *ClassService) AddStudent(classID, studentID uint) error {
	// Verificar que el estudiante existe y es STUDENT
	student, err := s.userRepo.GetByID(studentID)
	if err != nil {
		return errors.New("student not found")
	}
	if student.Role != "STUDENT" {
		return errors.New("user is not a student")
	}
	if !student.IsConfirmed {
		return errors.New("student account not confirmed")
	}

	return s.repo.AddStudent(classID, studentID)
}

func (s *ClassService) RemoveStudent(classID, studentID uint) error {
	return s.repo.RemoveStudent(classID, studentID)
}

func (s *ClassService) GetClassStudents(classID uint) ([]models.User, error) {
	return s.repo.GetStudents(classID)
}

// Verificar si un usuario es dueño de una clase
func (s *ClassService) IsOwner(classID, userID uint) (bool, error) {
	class, err := s.repo.FindByID(classID)
	if err != nil {
		return false, err
	}
	return class.ProfessorID == userID, nil
}
