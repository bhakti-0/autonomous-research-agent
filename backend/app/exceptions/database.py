from starlette import status

from app.exceptions.base import BaseAPIException


class DatabaseException(BaseAPIException):
    def __init__(self, detail: str = "Database error"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )