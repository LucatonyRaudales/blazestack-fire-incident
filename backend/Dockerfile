FROM golang:1.23-alpine

WORKDIR /app
RUN apk add --no-cache git

COPY backend/go.mod backend/go.sum ./
RUN go mod download

COPY backend ./

EXPOSE 3000
CMD ["go", "run", "main.go"]
