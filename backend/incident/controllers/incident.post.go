package controllers

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/LucatonyRaudales/blazestack-fire-incident/incident/model"
	"github.com/LucatonyRaudales/blazestack-fire-incident/incident/storage"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type IncidentsController struct {
	Store        *storage.Store
	UploadsDir   string
	PersistFiles bool
}

type createReq struct {
	Title        string `form:"title" json:"title" binding:"required"`
	Description  string `form:"description" json:"description"`
	IncidentType string `form:"incident_type" json:"incident_type" binding:"required"`
	Location     *model.Location `json:"location"`
	ImageBase64  string `form:"imageBase64" json:"imageBase64"`
}

func (ic *IncidentsController) Create(c *gin.Context) {
	var req createReq

	ct := c.GetHeader("Content-Type")
	if strings.HasPrefix(ct, "application/json") {
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON payload"})
			return
		}
	} else {
		if err := c.ShouldBind(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid form-data"})
			return
		}
	}

	if strings.TrimSpace(req.Title) == "" || !model.IsValidType(req.IncidentType) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "title and valid incident_type are required"})
		return
	}

	var imageURL string

	if file, err := c.FormFile("image"); err == nil && file != nil {
		_ = os.MkdirAll(ic.UploadsDir, 0755)
		ext := filepath.Ext(file.Filename)
		name := uuid.NewString() + ext
		dst := filepath.Join(ic.UploadsDir, name)
		if err := c.SaveUploadedFile(file, dst); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save file"})
			return
		}
		imageURL = "/uploads/" + name
	}

	now := time.Now().UTC().Format(time.RFC3339)
	item := model.Incident{
		ID:           uuid.NewString(),
		Title:        strings.TrimSpace(req.Title),
		Description:  strings.TrimSpace(req.Description),
		IncidentType: model.IncidentType(req.IncidentType),
		Location:     req.Location,
		ImageURL:     imageURL,
		CreatedAt:    now,
	}

	ic.Store.Add(item)
	c.JSON(http.StatusCreated, item)
}
