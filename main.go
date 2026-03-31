package main

import (
	"context"
	"log"
	"os"
	"time"

	"ChemistryTimes/internal/handler"
	"ChemistryTimes/internal/middleware"
	"ChemistryTimes/internal/repository"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	mongoURI := getEnv("MONGO_URI", "mongodb://localhost:27017")
	dbName := getEnv("DB_NAME", "chemistrytimes")
	port := getEnv("PORT", "17171")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer client.Disconnect(context.Background())

	if err := client.Ping(ctx, nil); err != nil {
		log.Fatalf("Failed to ping MongoDB: %v", err)
	}
	log.Println("Connected to MongoDB")

	db := client.Database(dbName)
	articleRepo := repository.NewArticleRepository(db)
	articleHandler := handler.NewArticleHandler(articleRepo)

	gameArticleRepo := repository.NewGameArticleRepository(db)
	gameArticleHandler := handler.NewGameArticleHandler(gameArticleRepo)

	uploadHandler := handler.NewUploadHandler("web/static/articles", "/chemistry-times/static/articles")

	r := gin.Default()

	r.LoadHTMLGlob("web/templates/*")

	auth := middleware.RequireAPIKey()

	ct := r.Group("/chemistry-times")
	{
		ct.Static("/static", "./web/static")
		ct.GET("", func(c *gin.Context) {
			c.HTML(200, "index.html", nil)
		})

		api := ct.Group("/api")
		{
			api.GET("/articles", articleHandler.List)
			api.GET("/articles/:id", articleHandler.GetByID)

			api.POST("/articles", auth, articleHandler.Create)
			api.PATCH("/articles/:id", auth, articleHandler.Update)
			api.DELETE("/articles/:id", auth, articleHandler.Delete)
			api.POST("/upload", auth, uploadHandler.Upload)
		}
	}

	cgt := r.Group("/chemistry-game-times")
	{
		cgt.Static("/static", "./web/static")
		cgt.GET("", func(c *gin.Context) {
			c.HTML(200, "game-index.html", nil)
		})

		api := cgt.Group("/api")
		{
			api.GET("/articles", gameArticleHandler.List)
			api.GET("/articles/:id", gameArticleHandler.GetByID)

			api.POST("/articles", auth, gameArticleHandler.Create)
			api.DELETE("/articles/:id", auth, gameArticleHandler.Delete)
		}
	}

	log.Printf("Server starting on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
