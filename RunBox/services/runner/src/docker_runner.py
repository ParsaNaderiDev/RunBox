from __future__ import annotations

import io
import tarfile
from contextlib import suppress

import docker
from docker.errors import DockerException, NotFound

from .config import settings


IMAGE_MAP = {
    "python": settings.python_image,
    "node": settings.node_image,
    "go": settings.go_image,
    "rust": settings.rust_image,
}

DEFAULT_RUN_COMMAND = {
    "python": "python Main.py",
    "node": "node Main.mjs",
    "go": "go run Main.go",
    "rust": "rustc Main.rs && ./Main",
}


class DockerSandbox:
    def __init__(self) -> None:
        self._client: docker.DockerClient | None = None

    def _get_client(self) -> docker.DockerClient:
        if self._client is None:
            self._client = docker.DockerClient(base_url=settings.docker_host)
        return self._client

    def _bundle_files(self, files: list[dict[str, str]]) -> bytes:
        tar_stream = io.BytesIO()
        with tarfile.open(fileobj=tar_stream, mode="w") as tar:
            for file in files:
                data = file["content"].encode()
                tarinfo = tarfile.TarInfo(name=file["name"])
                tarinfo.size = len(data)
                tarinfo.mtime = 0
                tarinfo.mode = 0o644
                tar.addfile(tarinfo, io.BytesIO(data))
        tar_stream.seek(0)
        return tar_stream.read()

    def run(
        self,
        language: str,
        files: list[dict[str, str]],
        build_cmd: str | None,
        run_cmd: str | None,
    ) -> str:
        image = IMAGE_MAP.get(language, settings.python_image)
        try:
            client = self._get_client()
        except DockerException as exc:
            return f"Runner unavailable: {exc}"

        container = None
        try:
            container = client.containers.create(
                image=image,
                command="/bin/sh",
                tty=True,
                stdin_open=True,
                detach=True,
                mem_limit=settings.sandbox_memory,
                nano_cpus=int(settings.sandbox_cpus * 1e9),
                network_disabled=True,
            )
            container.start()
            container.exec_run("mkdir -p /workspace")
            archive = self._bundle_files(files)
            container.put_archive(path="/workspace", data=archive)

            exec_commands: list[str] = ["cd /workspace"]
            if build_cmd:
                exec_commands.append(build_cmd)
            if run_cmd:
                exec_commands.append(run_cmd)
            else:
                default_cmd = DEFAULT_RUN_COMMAND.get(language)
                if default_cmd:
                    exec_commands.append(default_cmd)

            joined = " && ".join(filter(None, exec_commands))
            exit_code, output = container.exec_run(f"/bin/sh -lc '{joined}'", demux=True, tty=False)

            stdout = output[0].decode() if output and output[0] else ""
            stderr = output[1].decode() if output and output[1] else ""
            return stdout + stderr if exit_code == 0 else f"Process exited with code {exit_code}\n{stdout}{stderr}"
        except DockerException as exc:
            return f"Runner failure: {exc}"
        finally:
            if container:
                with suppress(NotFound, DockerException):
                    container.remove(force=True)


sandbox = DockerSandbox()
