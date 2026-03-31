package middleware

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

// RequireAPIKey returns a Gin middleware that rejects requests
// without a valid X-API-Key header. The expected key is read
// from the API_KEY environment variable.
func RequireAPIKey() gin.HandlerFunc {
	return func(c *gin.Context) {
		expected := os.Getenv("API_KEY")
		if expected == "" {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "API_KEY not configured"})
			c.Abort()
			return
		}

		provided := c.GetHeader("X-API-Key")
		if provided == "" || provided != expected {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid or missing API key"})
			c.Abort()
			return
		}

		c.Next()
	}
}
