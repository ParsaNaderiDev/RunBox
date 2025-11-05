# syntax=docker/dockerfile:1

FROM golang:1.22 AS golang
FROM node:20-slim AS node
FROM rust:1.77-slim AS rust

FROM python:3.11-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
        curl \
    && rm -rf /var/lib/apt/lists/*

# Go toolchain
COPY --from=golang /usr/local/go /usr/local/go
# Node.js runtime (node + npm)
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/bin/npm /usr/local/bin/npm
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
# Rust toolchain
COPY --from=rust /usr/local/cargo /usr/local/cargo
COPY --from=rust /usr/local/rustup /usr/local/rustup

ENV PATH="/usr/local/go/bin:/usr/local/cargo/bin:/usr/local/rustup/bin:/usr/local/bin:${PATH}"

COPY requirements/base.txt requirements/base.txt
RUN pip install --no-cache-dir -r requirements/base.txt

COPY ./src ./src
COPY ./.env.example ./.env.example

EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
