from functools import lru_cache
from typing import Any, List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "RunBox API"
    api_prefix: str = "/api"
    backend_cors_origins: List[str] | str = Field(default_factory=lambda: ["http://localhost:3000"])

    database_url: str = "postgresql+psycopg2://runbox:runbox@db:5432/runbox"
    redis_url: str = "redis://redis:6379/0"

    minio_endpoint: str = "minio:9000"
    minio_access_key: str = "runbox"
    minio_secret_key: str = "runbox-secret"
    minio_bucket: str = "artifacts"
    minio_secure: bool = False

    jwt_secret_key: str = "change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    runner_queue_name: str = "runbox-runs"

    model_config = SettingsConfigDict(env_file=".env", env_prefix="RUNBOX_")

    @field_validator("backend_cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: list[str] | str | None) -> List[str] | str:
        if value is None:
            return []
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    def model_post_init(self, __context: Any) -> None:
        if isinstance(self.backend_cors_origins, str):
            self.backend_cors_origins = [origin.strip() for origin in self.backend_cors_origins.split(",") if origin.strip()]


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
