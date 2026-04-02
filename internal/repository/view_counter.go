package repository

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ViewCounter struct {
	collection *mongo.Collection
	ch         chan string
}

type ViewCount struct {
	Channel string `bson:"_id" json:"channel"`
	Count   int64  `bson:"count" json:"count"`
}

func NewViewCounter(db *mongo.Database) *ViewCounter {
	vc := &ViewCounter{
		collection: db.Collection("view_counts"),
		ch:         make(chan string, 256),
	}
	go vc.worker()
	return vc
}

// Increment sends a channel name to the background worker for batched DB writes.
func (vc *ViewCounter) Increment(channel string) {
	select {
	case vc.ch <- channel:
	default:
		// Channel full — drop silently to avoid blocking request handlers.
	}
}

// GetCount returns the current view count for a channel.
func (vc *ViewCounter) GetCount(ctx context.Context, channel string) (int64, error) {
	var result ViewCount
	err := vc.collection.FindOne(ctx, bson.M{"_id": channel}).Decode(&result)
	if err == mongo.ErrNoDocuments {
		return 0, nil
	}
	if err != nil {
		return 0, err
	}
	return result.Count, nil
}

// worker drains the channel and flushes accumulated counts to MongoDB periodically.
func (vc *ViewCounter) worker() {
	pending := make(map[string]int64)
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case channel := <-vc.ch:
			pending[channel]++
		case <-ticker.C:
			vc.flush(pending)
			pending = make(map[string]int64)
		}
	}
}

func (vc *ViewCounter) flush(pending map[string]int64) {
	for channel, count := range pending {
		if count == 0 {
			continue
		}
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		_, err := vc.collection.UpdateOne(
			ctx,
			bson.M{"_id": channel},
			bson.M{"$inc": bson.M{"count": count}},
			options.Update().SetUpsert(true),
		)
		cancel()
		if err != nil {
			log.Printf("view_counter flush error (%s): %v", channel, err)
		}
	}
}
