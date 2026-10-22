from starlette import status

from app.exceptions.base import BaseAPIException


class ResearchException(BaseAPIException):
    def __init__(self, detail: str = "Research failed"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )