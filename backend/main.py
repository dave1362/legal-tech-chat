import json
import asyncio

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain_core.messages import HumanMessage, ToolMessage, AIMessageChunk

from backend.agent import get_agent

load_dotenv()

app = FastAPI()
agent = get_agent()

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

async def runner(model, prompt):
    input_messages = [HumanMessage(content=prompt)]
    messages = agent.astream(input={"messages": input_messages}, stream_mode="messages")

    async for chunk in messages:
        print(chunk)
        if isinstance(chunk[0], ToolMessage):
            yield f"data: {json.dumps({'text': chunk[0].content, 'type': 'tool_message'})}\n\n"
        else:
            yield f"data: {json.dumps({'text': chunk[0].content, 'type': 'text'})}\n\n"
        await asyncio.sleep(0.12)

    yield f"data: {json.dumps({'text': '', 'type': 'end'})}\n\n"

@app.post("/run/")
async def run(payload: RunPayload):
    return StreamingResponse(runner(model=payload.model, prompt=payload.prompt), media_type="text/event-stream")
