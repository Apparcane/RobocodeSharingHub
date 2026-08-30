from pydantic import BaseModel, ConfigDict

class WorkshopBase(BaseModel):
    title: str
    description: str
    age_category: str
    github_url: str

class WorkshopCreate(WorkshopBase):
    pass

class WorkshopResponse(WorkshopBase):
    id: int
    is_published: bool
    author_id: int

    model_config = ConfigDict(from_attributes=True)

class WorkshopDetailResponse(WorkshopResponse):
    readme_content: str | None = None