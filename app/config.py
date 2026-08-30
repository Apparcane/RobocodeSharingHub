from pydantic import ConfigDict
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres_password@db:5432/workshop_db"

    model_config = ConfigDict(env_file=".env")

settings = Settings()