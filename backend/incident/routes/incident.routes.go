package routes

import (
	"github.com/LucatonyRaudales/blazestack-fire-incident/incident/controllers"

	"github.com/gin-gonic/gin"
)

func RegisterIncidentRoutes(r *gin.Engine, ctrl *controllers.IncidentsController) {
	api := r.Group("/api")
	{
		api.GET("/incidents", ctrl.List)
		api.POST("/incidents", ctrl.Create)
	}
}
