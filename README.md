# 🚀 Robocode Sharing Hub Backend

An asynchronous RESTful API service built for sharing educational materials, workshops, and lab projects in Robotics and Software Engineering (Arduino, ESP32, Python, Web Development, and GameDev).

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

## 🛠 Tech Stack & Tools

- **Backend:** Python 3.11, FastAPI, Pydantic v2
- **Database & ORM:** PostgreSQL 16, SQLAlchemy 2.0 (Async Engine), Alembic (DB Migrations)
- **Authentication:** OAuth2 with JWT Tokens, Passlib (Bcrypt)
- **Testing:** Pytest, Pytest-Asyncio, HTTPX, SQLite (In-Memory for Isolated Testing)
- **Containerization & Infrastructure:** Docker, Docker Compose, Shell Automation (`entrypoint.sh`)
- **CI/CD:** GitHub Actions Pipeline

---

## ⚡ Quick Start with Docker

The easiest way to launch the application is using Docker Compose. It automatically spins up the PostgreSQL container, waits for the database socket to open, runs all pending Alembic migrations, and launches the FastAPI service.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Apparcane/RobocodeSharingHub.git](https://github.com/Apparcane/RobocodeSharingHub.git)
   cd robocodeSharingHub
   ```

2. **Run containers:**
   ```bash
   docker compose up --build
   ```

3. **Interactive API Documentation:**
   Once running, access the auto-generated Swagger and ReDoc documentation at:
   - **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
   - **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 🧪 Running Async Tests (Pytest)

The test suite runs against an isolated in-memory SQLite database to prevent polluting production or development environments.

1. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Linux/macOS
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run tests:**
   ```bash
   pytest -v
   ```

---

## 📁 Project Architecture

```text
├── app/
│   ├── main.py            # FastAPI Application Entry Point
│   ├── config.py          # Environment Settings (Pydantic Settings)
│   ├── db.py              # Async Database Session & Engine
│   ├── models/            # SQLAlchemy Database Models
│   ├── schemas/           # Pydantic Schemas (Data Validation & Serialization)
│   └── api/               # API Routers (Auth, Workshops, Users)
├── alembic/               # Database Migration Scripts
├── tests/                 # Async Pytest Test Suite
├── entrypoint.sh          # Container Startup Automation (Database Wait & Migration Runner)
├── Dockerfile             # Multi-stage Container Specification
├── docker-compose.yml     # Multi-container Orchestration
├── pytest.ini             # Pytest Configuration
└── requirements.txt       # Python Project Dependencies
```

---

## 📄 License

Distributed under the [MIT License](LICENSE).