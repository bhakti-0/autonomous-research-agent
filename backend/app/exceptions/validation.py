from starlette import status

from app.exceptions.base import BaseAPIException


class ValidationException(BaseAPIException):
    def __init__(self, detail: str = "Validation failed"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )