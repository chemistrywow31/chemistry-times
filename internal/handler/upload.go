package handler

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

var dateInFilenameRe = regexp.MustCompile(`(\d{4})(\d{2})\d{2}`)

type UploadHandler struct {
	storageDir string
	urlPrefix  string
}

func NewUploadHandler(storageDir, urlPrefix string) *UploadHandler {
	os.MkdirAll(storageDir, 0755)
	return &UploadHandler{storageDir: storageDir, urlPrefix: urlPrefix}
}

func (h *UploadHandler) Upload(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file is required"})
		return
	}

	// Sanitize filename — only allow safe characters
	filename := filepath.Base(file.Filename)
	if filename == "." || filename == "/" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid filename"})
		return
	}

	// Only allow web file extensions
	ext := strings.ToLower(filepath.Ext(filename))
	allowed := map[string]bool{
		".html": true, ".htm": true,
		".css": true, ".js": true,
		".png": true, ".jpg": true, ".jpeg": true,
		".gif": true, ".webp": true, ".svg": true,
	}
	if !allowed[ext] {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("file type %s not allowed", ext)})
		return
	}

	// Determine year/month subdirectory from filename or current date
	var year, month string
	if m := dateInFilenameRe.FindStringSubmatch(filename); m != nil {
		year, month = m[1], m[2]
	} else {
		now := time.Now()
		year = now.Format("2006")
		month = now.Format("01")
	}

	subDir := filepath.Join(year, month)
	dirPath := filepath.Join(h.storageDir, subDir)
	if err := os.MkdirAll(dirPath, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create directory"})
		return
	}

	dst := filepath.Join(dirPath, filename)
	if err := c.SaveUploadedFile(file, dst); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save file"})
		return
	}

	url := h.urlPrefix + "/" + subDir + "/" + filename
	c.JSON(http.StatusOK, gin.H{
		"url":      url,
		"filename": filename,
	})
}
