package handler

import (
	"net/http"

	"ChemistryTimes/internal/repository"

	"github.com/gin-gonic/gin"
)

type ViewCounterHandler struct {
	vc *repository.ViewCounter
}

func NewViewCounterHandler(vc *repository.ViewCounter) *ViewCounterHandler {
	return &ViewCounterHandler{vc: vc}
}

// Hit increments the site-wide view count and returns the total.
func (h *ViewCounterHandler) Hit(channel string) gin.HandlerFunc {
	return func(c *gin.Context) {
		h.vc.Increment(channel)

		count, err := h.vc.GetCount(c.Request.Context(), channel)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get view count"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"views": count})
	}
}

// Get returns the current site-wide view count without incrementing.
func (h *ViewCounterHandler) Get(channel string) gin.HandlerFunc {
	return func(c *gin.Context) {
		count, err := h.vc.GetCount(c.Request.Context(), channel)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get view count"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"views": count})
	}
}

// HitArticle increments both the per-article and site-wide view counts.
func (h *ViewCounterHandler) HitArticle(channel string) gin.HandlerFunc {
	return func(c *gin.Context) {
		articleID := c.Param("id")

		articleKey := "article:" + articleID
		h.vc.Increment(articleKey)
		h.vc.Increment(channel)

		articleViews, err := h.vc.GetCount(c.Request.Context(), articleKey)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get view count"})
			return
		}

		siteViews, err := h.vc.GetCount(c.Request.Context(), channel)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get view count"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"views": articleViews, "site_views": siteViews})
	}
}

// GetArticle returns the per-article view count without incrementing.
func (h *ViewCounterHandler) GetArticle() gin.HandlerFunc {
	return func(c *gin.Context) {
		articleID := c.Param("id")

		count, err := h.vc.GetCount(c.Request.Context(), "article:"+articleID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get view count"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"views": count})
	}
}
