import json
import asyncio
from typing import Type

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],  # Allow all origins
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/")
async def root():
    return {"status": "OK"}


class RunPayload(BaseModel):
    model: str
    prompt: str

async def fake_llm_stream():
    messages = [
        {"text": "my ", "type": "text"},
        {"text": "name ", "type": "text"},
        {"text": "is ", "type": "text"},
        {"text": "best ", "type": "text"},
        {"text": "ai ", "type": "text"},
        {"text": "on ", "type": "text"},
        {"text": "the ", "type": "text"},
        {"text": "world.", "type": "text"},
    ]
    for message in messages:
        yield f"data: {json.dumps(message)}\n\n"
        await asyncio.sleep(0.1)

    yield f"data: {json.dumps({'text': '', 'type': 'end'})}\n\n"

@app.post("/run/")
async def run(payload: RunPayload):
    return StreamingResponse(fake_llm_stream(), media_type="text/event-stream")
