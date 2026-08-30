from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.db import engine, Base

import app.models.user
import app.models.workshop

from app.api.auth import router as auth_router
from app.api.workshops import router as workshops_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(title="Robocode Sharing Hub API", lifespan=lifespan)

app.include_router(auth_router)
app.include_router(workshops_router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Robocode Sharing Hub API!"}