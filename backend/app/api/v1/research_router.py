from fastapi import APIRouter, BackgroundTasks, Depends, status
from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.schemas.research import ResearchCreate, ResearchResponse
from app.services.research import ResearchService


router = APIRouter(
    prefix="/research",
    tags=["Research"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

async def run_research_background(job_id: int):
    db = SessionLocal()

    try:
        service = ResearchService(db)
        await service.execute_research(job_id)
    finally:
        db.close()

@router.post(
    "",
    response_model=ResearchResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_research(
    data: ResearchCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    service = ResearchService(db)

    research = service.create_research_job(
        topic=data.topic
    )

    background_tasks.add_task(
        run_research_background,
        research.id,
    )

    return research

@router.get(
    "",
    response_model=list[ResearchResponse],
)
async def list_research(
    db: Session = Depends(get_db),
):
    service = ResearchService(db)

    return service.repository.list_all()

@router.get(
    "/{job_id}",
    response_model=ResearchResponse,
)

async def get_research(
    job_id: int,
    db: Session = Depends(get_db),
):
    service = ResearchService(db)

    research = service.repository.get_by_id(job_id)

    if not research:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=404,
            detail="Research job not found",
        )

    return research

@router.get(
    "/{job_id}/report",
)
async def get_research_report(
    job_id: int,
    db: Session = Depends(get_db),
):
    service = ResearchService(db)

    research = service.repository.get_by_id(job_id)

    if not research:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=404,
            detail="Research job not found",
        )

    if not research.report:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=404,
            detail="Research report not available",
        )

    return research.report