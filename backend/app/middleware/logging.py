import time

from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request

from app.core.logging import logger


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.perf_counter()

        logger.info(
            f"Incoming Request | {request.method} {request.url.path}"
        )

        response = await call_next(request)

        process_time = (time.perf_counter() - start_time) * 1000

        logger.info(
            f"Completed Request | "
            f"{request.method} {request.url.path} | "
            f"Status: {response.status_code} | "
            f"Time: {process_time:.2f}ms"
        )

        return response