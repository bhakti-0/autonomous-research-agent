from enum import StrEnum

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Environment(StrEnum):
    DEVELOPMENT = "development"
    TESTING = "testing"
    PRODUCTION = "production"


class LogLevel(StrEnum):
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    APP_NAME: str = Field(
    default="Autonomous Research Agent",
    min_length=3,
    max_length=100
)
    APP_VERSION: str = Field(
    default="1.0.0"
)
    ENVIRONMENT: Environment = Environment.DEVELOPMENT
    DEBUG: bool = False

    HOST: str = Field(default="0.0.0.0")
    PORT: int = Field(default=8000, ge=1, le=65535)

    SECRET_KEY: str = Field(
    min_length=32,
    description="JWT secret key"
)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
    default=60,
    ge=1,
    le=10080
)

    DATABASE_URL: str = Field(
    min_length=10
)

    REDIS_URL: str = Field(
    default="redis://localhost:6379/0"
)

    OPENAI_API_KEY: str | None = None
    ANTHROPIC_API_KEY: str | None = None
    GOOGLE_API_KEY: str | None = None

    TAVILY_API_KEY: str | None = None
    GITHUB_TOKEN: str | None = None

    LOG_LEVEL: LogLevel = LogLevel.DEBUG

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT is Environment.PRODUCTION

    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT is Environment.DEVELOPMENT

    @property
    def is_testing(self) -> bool:
        return self.ENVIRONMENT is Environment.TESTING