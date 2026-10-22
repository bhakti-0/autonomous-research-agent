from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.research import ResearchJob




class ResearchRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(self, topic: str) -> ResearchJob:
        job = ResearchJob(
            topic=topic,
            status="pending",
        )

        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)

        return job

    def get_by_id(self, job_id: int) -> ResearchJob | None:
        statement = select(ResearchJob).where(
            ResearchJob.id == job_id
        )

        return self.db.scalar(statement)

    def list_all(self) -> list[ResearchJob]:
        statement = select(ResearchJob).order_by(
            ResearchJob.created_at.desc()
        )

        return list(self.db.scalars(statement).all())

    def update_status(
        self,
        job_id: int,
        status: str,
    ) -> ResearchJob | None:

        job = self.get_by_id(job_id)

        if job is None:
            return None

        job.status = status

        self.db.commit()
        self.db.refresh(job)

        return job

    def delete(self, job_id: int) -> bool:
        job = self.get_by_id(job_id)

        if job is None:
            return False

        self.db.delete(job)
        self.db.commit()

        return True

    def update_report(
        self,
        job_id: int,
        report: dict,
    ) -> ResearchJob | None:

        job = self.get_by_id(job_id)

        if job is None:
            return None

        job.report = report

        self.db.commit()
        self.db.refresh(job)

        return job

    def update_error(
        self,
        job_id: int,
        error: str,
    ) -> ResearchJob | None:

        job = self.get_by_id(job_id)

        if job is None:
            return None

        job.error = error

        self.db.commit()
        self.db.refresh(job)

        return job