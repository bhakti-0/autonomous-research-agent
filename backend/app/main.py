from app.core.logging import setup_logging, logger
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings
from app.exceptions.handlers import register_exception_handlers
from app.middleware.logging import LoggingMiddleware
from app.database.db import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()

    yield


def create_app() -> FastAPI:
        setup_logging()
        logger.info("Starting Autonomous Research Agent...")
        app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        docs_url=None if settings.is_production else "/docs",
        redoc_url=None if settings.is_production else "/redoc",
        lifespan=lifespan,
    )

        app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
        app.add_middleware(LoggingMiddleware)

        app.include_router(api_router)

        register_exception_handlers(app)

        return app


app = create_app()


