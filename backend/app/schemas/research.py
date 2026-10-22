from datetime import datetime

from pydantic import BaseModel, Field


class ResearchCreate(BaseModel):
    topic: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="Research topic to investigate",
    )


class ResearchStatusUpdate(BaseModel):
    status: str = Field(
        ...,
        description="New research job status",
    )


class ResearchResponse(BaseModel):
    id: int
    topic: str
    status: str
    created_at: datetime
    report: dict | None = None
    error: str | None = None

    model_config = {
        "from_attributes": True
    }