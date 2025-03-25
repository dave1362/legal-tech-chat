import json
import asyncio

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain_core.messages import HumanMessage, ToolMessage, AIMessageChunk
from backend.agent_manager import AgentManager


load_dotenv()

agent_manager = AgentManager()

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


async def runner(model, prompt):
    input_messages = [HumanMessage(content=prompt)]
    messages = agent_manager.get_model_by_name(model).astream(
        input={"messages": input_messages}, stream_mode="messages"
    )

    async for chunk in messages:
        # output tool call section type
        if hasattr(chunk[0], "tool_calls") and len(chunk[0].tool_calls) > 0:
            tool_calls_content = json.dumps(chunk[0].tool_calls)
            yield f"data: {json.dumps({'content': tool_calls_content, 'type': 'tool_call'})}\n\n"

        if isinstance(chunk[0], ToolMessage):
            yield f"data: {json.dumps({'content': chunk[0].content, 'type': 'tool_message'})}\n\n"
        if isinstance(chunk[0], AIMessageChunk):
            yield f"data: {json.dumps({'content': chunk[0].content, 'type': 'ai_message'})}\n\n"
        if isinstance(chunk[0], HumanMessage):
            yield f"data: {json.dumps({'content': chunk[0].content, 'type': 'user_message'})}\n\n"
        # await asyncio.sleep(0.12)

    yield f"data: {json.dumps({'content': '', 'type': 'end'})}\n\n"


@app.post("/run/")
async def run(payload: RunPayload):
    return StreamingResponse(
        runner(model=payload.model, prompt=payload.prompt),
        media_type="text/event-stream",
    )
