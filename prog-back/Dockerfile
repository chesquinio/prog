# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY go.mod go.sum ./
RUN go mod download

# Copiar todo el código fuente
COPY . .

# Compilar la aplicación
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o programacion-backend .

# Final stage
FROM alpine:3.18

# Instalar certificados CA para HTTPS
RUN apk add --no-cache ca-certificates

WORKDIR /root/

# Copiar el binario compilado
COPY --from=builder /app/programacion-backend .

# Copiar archivos SQL del seeder si existen
COPY --from=builder /app/internal/seeder/sql ./internal/seeder/sql

# Configurar modo de producción de Gin
ENV GIN_MODE=release

# Exponer el puerto 8080
EXPOSE 8080

# Ejecutar la aplicación
CMD ["./programacion-backend"]
