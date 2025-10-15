package routes

import (
	"programcion-backend/internal/controllers"
	"programcion-backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", controllers.Register)
			auth.POST("/login", controllers.Login)
			auth.GET("/me", middleware.RequireAuthentication(), controllers.AuthMe)
			auth.POST("/logout", controllers.Logout)
		}

		users := api.Group("/users")
		{
			users.GET("", middleware.RequireAuthentication(), middleware.RequireRole("ADMIN"), controllers.ListUsers)
			users.GET("/:id", middleware.RequireAuthentication(), controllers.GetUser)
			users.PATCH("/:id/confirm", middleware.RequireAuthentication(), middleware.RequireRole("ADMIN"), controllers.ConfirmUser)
		}

		buildings := api.Group("/buildings")
		{
			buildings.GET("", controllers.ListBuildings)
			buildings.POST("", middleware.RequireAuthentication(), middleware.RequireRole("ADMIN"), controllers.CreateBuilding)
			buildings.GET("/:id", controllers.GetBuilding)
		}

		rooms := api.Group("/rooms")
		{
			rooms.GET("", controllers.ListRooms)
			rooms.POST("", middleware.RequireAuthentication(), middleware.RequireRole("ADMIN"), controllers.CreateRoom)
			rooms.GET("/:id", controllers.GetRoom)
			rooms.PATCH("/:id", middleware.RequireAuthentication(), middleware.RequireRole("ADMIN"), controllers.UpdateRoom)
			rooms.DELETE("/:id", middleware.RequireAuthentication(), middleware.RequireRole("ADMIN"), controllers.DeleteRoom)
		}

		reservations := api.Group("/reservations")
		{
			reservations.POST("", middleware.RequireAuthentication(), middleware.RequireRole("PROFESSOR"), controllers.CreateReservation)
			reservations.GET("", middleware.RequireAuthentication(), controllers.ListReservations)
			reservations.GET("/:id", middleware.RequireAuthentication(), controllers.GetReservation)
			reservations.PATCH("/:id", middleware.RequireAuthentication(), middleware.RequireRole("ADMIN"), controllers.CancelReservation)
			reservations.DELETE("/:id", middleware.RequireAuthentication(), middleware.RequireRole("ADMIN"), controllers.CancelReservation)
		}

		classes := api.Group("/classes")
		{
			classes.POST("", middleware.RequireAuthentication(), middleware.RequireRole("PROFESSOR"), controllers.CreateClass)
			classes.GET("", middleware.RequireAuthentication(), controllers.ListClasses)
			classes.GET("/:id", middleware.RequireAuthentication(), controllers.GetClass)
			classes.PATCH("/:id", middleware.RequireAuthentication(), controllers.UpdateClass)
			classes.DELETE("/:id", middleware.RequireAuthentication(), controllers.DeleteClass)
			classes.POST("/:id/students", middleware.RequireAuthentication(), middleware.RequireRole("PROFESSOR"), controllers.AddStudent)
			classes.DELETE("/:id/students/:student_id", middleware.RequireAuthentication(), middleware.RequireRole("PROFESSOR"), controllers.RemoveStudent)
			classes.GET("/:id/students", middleware.RequireAuthentication(), controllers.ListClassStudents)
		}

		// Public endpoints
		public := api.Group("/public")
		{
			public.GET("/reservations", controllers.GetPublicReservations)
		}
	}
}
