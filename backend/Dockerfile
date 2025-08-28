FROM golang:1.23-alpine

WORKDIR /app
RUN apk add --no-cache git

# Copia go.mod/sum para cache de deps
COPY backend/go.mod backend/go.sum ./
RUN go mod download

# Copia el resto (en runtime montamos el código con volumes)
COPY backend ./

EXPOSE 3000
CMD ["go", "run", "main.go"]
