package repository

import (
	"context"
	"math"
	"time"

	"ChemistryTimes/internal/model"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type GameArticleRepository struct {
	collection *mongo.Collection
}

func NewGameArticleRepository(db *mongo.Database) *GameArticleRepository {
	return &GameArticleRepository{
		collection: db.Collection("game_articles"),
	}
}

func (r *GameArticleRepository) Create(ctx context.Context, article *model.Article) error {
	article.CreatedAt = time.Now()
	result, err := r.collection.InsertOne(ctx, article)
	if err != nil {
		return err
	}
	article.ID = result.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *GameArticleRepository) FindByID(ctx context.Context, id primitive.ObjectID) (*model.Article, error) {
	var article model.Article
	if err := r.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&article); err != nil {
		return nil, err
	}
	return &article, nil
}

func (r *GameArticleRepository) Delete(ctx context.Context, id primitive.ObjectID) error {
	result, err := r.collection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return err
	}
	if result.DeletedCount == 0 {
		return mongo.ErrNoDocuments
	}
	return nil
}

func (r *GameArticleRepository) List(ctx context.Context, page, limit int) (*model.ArticleListResponse, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 50 {
		limit = 10
	}

	total, err := r.collection.CountDocuments(ctx, bson.M{})
	if err != nil {
		return nil, err
	}

	skip := int64((page - 1) * limit)
	opts := options.Find().
		SetSort(bson.D{{Key: "date", Value: -1}}).
		SetSkip(skip).
		SetLimit(int64(limit))

	cursor, err := r.collection.Find(ctx, bson.M{}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var articles []model.Article
	if err := cursor.All(ctx, &articles); err != nil {
		return nil, err
	}
	if articles == nil {
		articles = []model.Article{}
	}

	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	return &model.ArticleListResponse{
		Articles:   articles,
		Total:      total,
		Page:       page,
		Limit:      limit,
		TotalPages: totalPages,
	}, nil
}
