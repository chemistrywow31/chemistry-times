FROM golang:1.24-alpine AS builder

RUN apk add --no-cache git

WORKDIR /app

COPY go.mod ./

COPY . .
RUN GOPROXY=https://goproxy.io,direct \
    go mod tidy && \
    CGO_ENABLED=0 GOOS=linux go build -o chemistrytimes .

FROM alpine:3.21

RUN apk --no-cache add ca-certificates tzdata
ENV TZ=Asia/Taipei

WORKDIR /app

COPY --from=builder /app/chemistrytimes .
COPY --from=builder /app/web ./web

EXPOSE 17171

CMD ["./chemistrytimes"]
