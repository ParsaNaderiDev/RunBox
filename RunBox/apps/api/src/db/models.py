from datetime import datetime
from typing import List, Optional

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from .base import Base


class User(Base):
    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(50), default="admin")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    last_login: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    runs: Mapped[List["Run"]] = relationship("Run", back_populates="user")


class Project(Base):
    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    language: Mapped[str] = mapped_column(String(50))
    tags: Mapped[list[str]] = mapped_column(JSONB, default=list)
    cover_url: Mapped[Optional[str]] = mapped_column(String(500))
    readme_md: Mapped[Optional[str]] = mapped_column(Text)
    build_cmd: Mapped[Optional[str]] = mapped_column(String(255))
    run_cmd: Mapped[Optional[str]] = mapped_column(String(255))
    status: Mapped[str] = mapped_column(String(50), default="draft")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    runs: Mapped[List["Run"]] = relationship("Run", back_populates="project")


class Run(Base):
    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True)
    status: Mapped[str] = mapped_column(String(50), default="queued")
    language: Mapped[str] = mapped_column(String(50))
    logs_s3_key: Mapped[Optional[str]] = mapped_column(String(255))
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    finished_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    runtime_ms: Mapped[Optional[int]] = mapped_column()

    user_id: Mapped[Optional[str]] = mapped_column(UUID(as_uuid=False), ForeignKey("user.id"))
    project_id: Mapped[Optional[str]] = mapped_column(UUID(as_uuid=False), ForeignKey("project.id"))

    payload: Mapped[dict] = mapped_column(JSONB, default=dict)

    user: Mapped[Optional[User]] = relationship("User", back_populates="runs")
    project: Mapped[Optional[Project]] = relationship("Project", back_populates="runs")

