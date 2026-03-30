package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Article struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title     string             `bson:"title" json:"title" binding:"required"`
	TitleEN   string             `bson:"title_en,omitempty" json:"title_en,omitempty"`
	URL       string             `bson:"url" json:"url" binding:"required"`
	Date      string             `bson:"date" json:"date" binding:"required"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
}

type ArticleListResponse struct {
	Articles   []Article `json:"articles"`
	Total      int64     `json:"total"`
	Page       int       `json:"page"`
	Limit      int       `json:"limit"`
	TotalPages int       `json:"total_pages"`
}
