from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    redis_url: str = "redis://redis:6379/0"
    queue_name: str = "runbox-runs"
    docker_host: str = "unix://var/run/docker.sock"
    sandbox_timeout: int = 30
    sandbox_cpus: float = 0.5
    sandbox_memory: str = "512m"

    python_image: str = "python:3.11-slim"
    node_image: str = "node:20-slim"
    go_image: str = "golang:1.21-alpine"
    rust_image: str = "rust:1.74-slim"

    model_config = SettingsConfigDict(env_file=".env", env_prefix="RUNBOX_")


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
