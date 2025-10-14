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
			users.PATCH(":id/confirm", middleware.RequireAuthentication(), middleware.RequireRole("ADMIN"), controllers.ConfirmUser)
		}

		buildings := api.Group("/buildings")
		{
			buildings.GET("", controllers.ListBuildings)
			buildings.POST("", middleware.RequireAuthentication(), middleware.RequireRole("ADMIN"), controllers.CreateBuilding)
			buildings.GET(":id", controllers.GetBuilding)
		}

		rooms := api.Group("/rooms")
		{
			rooms.GET("", controllers.ListRooms)
			rooms.POST("", middleware.RequireAuthentication(), middleware.RequireRole("ADMIN"), controllers.CreateRoom)
			rooms.GET(":id", controllers.GetRoom)
			rooms.PATCH(":id", middleware.RequireAuthentication(), middleware.RequireRole("ADMIN"), controllers.UpdateRoom)
			rooms.DELETE(":id", middleware.RequireAuthentication(), middleware.RequireRole("ADMIN"), controllers.DeleteRoom)
		}

		reservations := api.Group("/reservations")
		{
			reservations.POST("", middleware.RequireAuthentication(), middleware.RequireRole("PROFESSOR"), controllers.CreateReservation)
			reservations.GET("", middleware.RequireAuthentication(), controllers.ListReservations)
			reservations.GET(":id", middleware.RequireAuthentication(), controllers.GetReservation)
			reservations.PATCH(":id", middleware.RequireAuthentication(), middleware.RequireRole("ADMIN"), controllers.CancelReservation)
			reservations.DELETE(":id", middleware.RequireAuthentication(), middleware.RequireRole("ADMIN"), controllers.CancelReservation)
		}
		// Public endpoints
		public := api.Group("/public")
		{
			public.GET("/reservations", controllers.GetPublicReservations)
		}
	}
}
