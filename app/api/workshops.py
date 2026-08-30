from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db import get_db
from app.models.workshop import Workshop
from app.schemas.workshop import WorkshopCreate, WorkshopResponse, WorkshopDetailResponse
from app.github.github import fetch_readme_content
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter(prefix="/workshops", tags=["Workshops"])

@router.post("/", response_model=WorkshopResponse, status_code=status.HTTP_201_CREATED)
async def create_workshop(workshop: WorkshopCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_workshop = Workshop(**workshop.model_dump(), author_id=current_user.id)
    db.add(new_workshop)
    await db.commit()
    await db.refresh(new_workshop)
    return new_workshop

@router.get("/", response_model=list[WorkshopResponse], status_code=status.HTTP_200_OK)
async def get_workshops(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Workshop))
    workshops = result.scalars().all()
    return workshops

@router.get("/{workshop_id}", response_model=WorkshopDetailResponse, status_code=status.HTTP_200_OK)
async def get_workshop_readme(workshop_id: int, db: AsyncSession = Depends(get_db)):
    workshop = await db.get(Workshop, workshop_id)
    if workshop is None:
        raise HTTPException(status_code=404, detail="Workshop not found")
    try:
        readme_content = await fetch_readme_content(workshop.github_url)
    except HTTPException:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch README from GitHub")
    
    response_data = WorkshopDetailResponse.model_validate(workshop)
    response_data.readme_content = readme_content

    return response_data

@router.delete("/{workshop_id}", status_code=status.HTTP_200_OK)
async def delete_workshop(workshop_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    workshop = await db.get(Workshop, workshop_id)

    if workshop is None:
        raise HTTPException(status_code=404, detail="Workshop not found")

    if workshop.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to delete this workshop")

    await db.delete(workshop)
    await db.commit()

    return {"detail": "Workshop deleted successfully"}

@router.put("/{workshop_id}", response_model=WorkshopResponse)
async def update_workshop(workshop_id: int, workshop_update: WorkshopCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    workshop = await db.get(Workshop, workshop_id)

    if workshop is None:
        raise HTTPException(status_code=404, detail="Workshop not found")

    if workshop.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to update this workshop")

    update_data = workshop_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(workshop, key, value)

    await db.commit()
    await db.refresh(workshop)
    return workshop