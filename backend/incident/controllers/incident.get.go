package controllers

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func (ic *IncidentsController) List(c *gin.Context) {
	c.JSON(http.StatusOK, ic.Store.List())
}