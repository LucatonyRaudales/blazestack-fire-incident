package main

import (
	"log"
	"os"

	"github.com/LucatonyRaudales/blazestack-fire-incident/incident/controllers"
	"github.com/LucatonyRaudales/blazestack-fire-incident/incident/routes"
	"github.com/LucatonyRaudales/blazestack-fire-incident/incident/storage"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func setupRouter() *gin.Engine {
	r := gin.Default()

	// CORS por defecto (permite dev local: :5173 → :3000)
	r.Use(cors.Default())

	// Estáticos para /uploads
	uploadsDir := "server/uploads"
	if err := os.MkdirAll(uploadsDir, 0755); err != nil {
		log.Printf("warning: could not create uploads dir: %v", err)
	}
	r.Static("/uploads", uploadsDir)

	// Store con persistencia JSON (opcional). Cambia a false si no quieres persistir.
	store := storage.NewStore("server/incidents.json", true)

	// Controller
	incidentsCtrl := &controllers.IncidentsController{
		Store:      store,
		UploadsDir: uploadsDir,
	}

	// Rutas
	routes.RegisterIncidentRoutes(r, incidentsCtrl)

	return r
}

func main() {
	r := setupRouter()
	if err := r.Run(":3000"); err != nil {
		log.Fatal(err)
	}
}
