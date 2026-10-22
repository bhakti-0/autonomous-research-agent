from sqlalchemy.orm import Session

from app.models.research import ResearchJob
from app.repositories.research import ResearchRepository
from app.agents.research_agent import ResearchAgent


class ResearchService:

    def __init__(self, db: Session):
        self.repository = ResearchRepository(db)
        self.agent = ResearchAgent()

    def create_research_job(self, topic: str) -> ResearchJob:
        topic = topic.strip()

        if not topic:
            raise ValueError("Research topic cannot be empty.")

        if len(topic) > 500:
            raise ValueError(
                "Research topic cannot exceed 500 characters."
            )

        return self.repository.create(topic)

    def get_research_job(
        self,
        job_id: int,
    ) -> ResearchJob | None:
        return self.repository.get_by_id(job_id)

    def list_research_jobs(self) -> list[ResearchJob]:
        return self.repository.list_all()

    def update_research_status(
        self,
        job_id: int,
        status: str,
    ) -> ResearchJob | None:

        allowed_statuses = {
            "pending",
            "running",
            "completed",
            "failed",
        }

        if status not in allowed_statuses:
            raise ValueError(
                f"Invalid status: {status}"
            )

        return self.repository.update_status(
            job_id,
            status,
        )
    async def execute_research(
        self,
        job_id: int,
    ) -> ResearchJob | None:

        job = self.repository.get_by_id(job_id)

        if not job:
         return None

        try:
         # Mark job as running
            self.repository.update_status(
            job_id,
            "running",
    )

        # Run the actual research agent
            result = await self.agent.run(
            job.topic
            )

        # Extract final report
            report = result["report"]

        # Save report
            self.repository.update_report(
                job_id,
                report,
        )

        # Mark job as completed
            return self.repository.update_status(
                job_id,
                "completed",
        )

        except Exception as e:
            error_message = str(e)

            print(f"Research job {job_id} failed: {error_message}")

            self.repository.update_error(
            job_id,
            error_message,
            )

            self.repository.update_status(
            job_id,
            "failed",
            )

        return self.repository.get_by_id(job_id)
    
    def delete_research_job(self, job_id: int) -> bool:
        return self.repository.delete(job_id)