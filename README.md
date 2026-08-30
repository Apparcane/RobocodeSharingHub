# 🚀 Robocode Sharing Hub Backend

Асинхронный REST API сервис для обмена учебными материалами, мастер-классами и проектами по робототехнике и программированию (Arduino, Python, Web, GameDev).

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

## 🛠 Технологический стек

- **Backend:** Python 3.11, FastAPI, Pydantic v2
- **Database & ORM:** PostgreSQL 16, SQLAlchemy 2.0 (Async), Alembic (миграции)
- **Auth:** OAuth2 (JWT Tokens), Passlib (Bcrypt)
- **Testing:** Pytest, Pytest-Asyncio, HTTPX, SQLite (In-Memory)
- **Containerization & CI/CD:** Docker, Docker Compose, GitHub Actions

---

## 📦 Быстрый запуск через Docker

Самый простой способ запустить проект — через Docker Compose. Он автоматически поднимет базу данных PostgreSQL, выполнит необходимые миграции Alembic и запустит сервер FastAPI.

1. **Клонируйте репозиторий:**
   ```bash
   git clone [https://github.com/Apparcane/RobocodeSharingHub.git](https://github.com/Apparcane/RobocodeSharingHub.git)
   cd robocodeSharingHub
   ```

2. **Запустите контейнеры:**
   ```bash
   docker compose up --build
   ```

3. **Интерактивная документация API:**
   После успешного запуска документация будет доступна по адресам:
   - Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
   - ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 🧪 Запуск тестов (Pytest)

Для прогона асинхронных тестов локально:

1. Создайте и активируйте виртуальное окружение:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/macOS
   ```

2. Установите зависимости:
   ```bash
   pip install -r requirements.txt
   ```

3. Запустите тесты:
   ```bash
   pytest -v
   ```

---

## 📁 Структура проекта

```text
├── app/
│   ├── main.py            # Точка входа FastAPI
│   ├── config.py          # Настройки приложения (Pydantic Settings)
│   ├── db.py              # Подключение к PostgreSQL (Async Engine)
│   ├── models/            # Модели SQLAlchemy
│   ├── schemas/           # Pydantic схемы
│   └── api/               # Эндпоинты API (Auth, Workshops, etc.)
├── alembic/               # Файлы миграций базы данных
├── tests/                 # Асинхронные тесты Pytest
├── entrypoint.sh          # Скрипт ожидания БД и авто-миграций в Docker
├── Dockerfile             # Сборка образа веб-сервиса
├── docker-compose.yml     # Оркестрация контейнеров
└── pytest.ini             # Конфигурация Pytest
```

---

## 📄 Лицензия

Проект распространяется под лицензией [MIT](LICENSE).