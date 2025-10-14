package services

import (
	"errors"
	"os"
	"time"

	"programcion-backend/internal/models"
	"programcion-backend/internal/repositories"
	"programcion-backend/pkg/utils"

	"github.com/golang-jwt/jwt/v5"
)

type AuthService struct {
	repo *repositories.UserRepository
}

func NewAuthService() *AuthService {
	return &AuthService{repo: repositories.NewUserRepository()}
}

func (s *AuthService) Register(name, email, password, role string) (*models.User, error) {
	// hash
	hash, err := utils.HashPassword(password)
	if err != nil {
		return nil, err
	}
	user := &models.User{
		Name:         name,
		Email:        email,
		PasswordHash: hash,
		Role:         role,
		IsConfirmed:  false,
	}
	if err := s.repo.Create(user); err != nil {
		return nil, err
	}
	return user, nil
}

func (s *AuthService) Login(email, password string) (string, error) {
	u, err := s.repo.GetByEmail(email)
	if err != nil {
		return "", err
	}
	if !utils.CheckPasswordHash(password, u.PasswordHash) {
		return "", errors.New("invalid credentials")
	}
	if !u.IsConfirmed {
		return "", errors.New("account not confirmed")
	}

	// generar JWT
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "dev_secret"
	}
	expHours := 24
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":  u.ID,
		"role": u.Role,
		"exp":  time.Now().Add(time.Duration(expHours) * time.Hour).Unix(),
	})
	tokStr, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}
	return tokStr, nil
}

func (s *AuthService) ConfirmUser(id uint) error {
	u, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}
	u.IsConfirmed = true
	return s.repo.Update(u)
}

func (s *AuthService) GetUserByID(id uint) (*models.User, error) {
	return s.repo.GetByID(id)
}
