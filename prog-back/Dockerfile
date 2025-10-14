# Build stage
FROM golang:1.23-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /programacion-backend ./

# Final stage
FROM alpine:3.18
RUN apk add --no-cache ca-certificates
WORKDIR /root/
COPY --from=builder /programacion-backend /usr/local/bin/programacion-backend
# Copiar seeds SQL para que el seeder pueda ejecutarlos en tiempo de arranque
COPY internal/seeder/sql /app/sql
ENV GIN_MODE=release
EXPOSE 8080
CMD ["/usr/local/bin/programacion-backend"]
