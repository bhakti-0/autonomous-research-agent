from fastapi import HTTPException
from starlette import status


class BaseAPIException(HTTPException):
    def __init__(
        self,
        detail: str,
        status_code: int = status.HTTP_400_BAD_REQUEST,
    ):
        super().__init__(
            status_code=status_code,
            detail=detail,
        )