from fastapi import FastAPI
from pydantic import BaseModel
import subprocess, tempfile, os, sys

app = FastAPI()


class RunRequest(BaseModel):
    code: str


@app.post("/run")
def run_code(req: RunRequest):
    with tempfile.NamedTemporaryFile(suffix=".py", delete=False, mode="w") as f:
        f.write(req.code)
        tmpfile = f.name
    try:
        result = subprocess.run(
            [sys.executable, tmpfile], capture_output=True, text=True, timeout=30
        )
        success = result.returncode == 0
        output = (result.stdout or result.stderr or "").strip()
        return {"success": success, "output": output}
    except subprocess.TimeoutExpired:
        return {"success": False, "output": "Execution timed out"}
    finally:
        os.unlink(tmpfile)
