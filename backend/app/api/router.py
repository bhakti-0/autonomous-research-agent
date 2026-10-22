from fastapi import APIRouter

from app.api.v1.research_router import router as research_router
from app.exceptions.database import DatabaseException


api_router = APIRouter()

v1_router = APIRouter(
    prefix="/api/v1"
)


@v1_router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Autonomous Research Agent",
        "version": "1.0.0",
    }


@v1_router.get("/test-error")
async def test_error():
    raise DatabaseException(
        "Database connection failed"
    )


v1_router.include_router(research_router)

api_router.include_router(v1_router)