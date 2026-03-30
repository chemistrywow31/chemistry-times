.PHONY: mongo mongo-stop mongo-clean run build

MONGO_CONTAINER := chemistrytimes-mongo
MONGO_PORT := 27017

mongo:
	@docker start $(MONGO_CONTAINER) 2>/dev/null || \
		docker run -d --name $(MONGO_CONTAINER) \
			-p $(MONGO_PORT):27017 \
			-v $(PWD)/.mongo-data:/data/db \
			mongo:7
	@echo "MongoDB running on localhost:$(MONGO_PORT)"

mongo-stop:
	@docker stop $(MONGO_CONTAINER) 2>/dev/null; true
	@echo "MongoDB stopped"

mongo-clean: mongo-stop
	@docker rm $(MONGO_CONTAINER) 2>/dev/null; true
	@rm -rf .mongo-data
	@echo "MongoDB container and data removed"

run: mongo
	go run .

build:
	go build -o chemistrytimes .
