#!/bin/sh

# Останавливаем выполнение при любой ошибке
set -e

echo "Waiting for PostgreSQL to start..."

# Ждём, пока порт 5432 на хосте db станет доступен
while ! nc -z db 5432; do
    sleep 0.5
done

echo "PostgreSQL is up and running!"

echo "Running Alembic migrations..."
alembic upgrade head

echo "Starting Uvicorn..."
exec "$@"