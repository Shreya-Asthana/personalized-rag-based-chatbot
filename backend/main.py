from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from backend.drive.fetch import ingest_drive_folder
from backend.chat.retrieval import retrieve_answer

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IngestRequest(BaseModel):
    drive_folder_url: str

class ChatRequest(BaseModel):
    message: str

@app.post("/api/ingest")
async def ingest(req: IngestRequest):
    return StreamingResponse(ingest_drive_folder(req.drive_folder_url), media_type="application/x-ndjson")

@app.post("/api/chat")
async def chat(req: ChatRequest):
    return retrieve_answer(req.message)