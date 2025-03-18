import json
from typing import Type

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, StreamingResponse
from pydantic import BaseModel

load_dotenv()

app = FastAPI()

@app.get("/")
async def root():
    return {"status": "OK"}


class RunPayload(BaseModel):
    llm: str
    context: str

@app.post("/run/")
async def run(payload: RunPayload):
    llm = payload.llm
    context = payload.context

    return {
        "llm": llm,
        "context": context,
    }
