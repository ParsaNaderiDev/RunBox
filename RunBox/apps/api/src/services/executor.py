from __future__ import annotations

import os
import subprocess
from dataclasses import dataclass
from pathlib import Path
from tempfile import TemporaryDirectory
from typing import List

DEFAULT_COMMANDS = {
    "python": "python3 Main.py",
    "node": "/usr/local/bin/node Main.mjs",
    "go": "/usr/local/go/bin/go run Main.go",
    "rust": "/usr/local/rustup/toolchains/1.77.2-x86_64-unknown-linux-gnu/bin/rustc Main.rs && ./Main",
}

ENV_OVERRIDES = {
    "node": {"NODE_ENV": "production"},
}


@dataclass
class ExecutionResult:
    exit_code: int
    stdout: str
    stderr: str

    @property
    def output(self) -> str:
        combined = self.stdout.strip()
        if self.stderr.strip():
            return f"{combined}\n{self.stderr.strip()}" if combined else self.stderr.strip()
        return combined


class LocalSandbox:
    def run(
        self,
        language: str,
        files: List[dict[str, str]],
        build_cmd: str | None,
        run_cmd: str | None,
    ) -> ExecutionResult:
        command = run_cmd or DEFAULT_COMMANDS.get(language)
        if not command:
            return ExecutionResult(1, "", f"Language '{language}' is not supported.")

        with TemporaryDirectory(prefix="runbox-") as tmp:
            workspace = Path(tmp)
            for file in files:
                path = workspace / file["name"]
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(file["content"], encoding="utf-8")

            env = os.environ.copy()
            env.update(ENV_OVERRIDES.get(language, {}))

            if build_cmd:
                build = subprocess.run(
                    build_cmd,
                    cwd=workspace,
                    shell=True,
                    text=True,
                    capture_output=True,
                    env=env,
                )
                if build.returncode != 0:
                    return ExecutionResult(build.returncode, build.stdout, build.stderr)

            process = subprocess.run(
                command,
                cwd=workspace,
                shell=True,
                text=True,
                capture_output=True,
                env=env,
            )
            return ExecutionResult(process.returncode, process.stdout, process.stderr)


sandbox = LocalSandbox()
