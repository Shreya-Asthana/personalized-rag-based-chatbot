from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from backend.drive.fetch import ingest_drive_folder
from backend.chat.retrieval import retrieve_answer

app = FastAPI()

class IngestRequest(BaseModel):
    drive_folder_url: str

class ChatRequest(BaseModel):
    message: str

@app.post("/api/ingest")
async def ingest(req: IngestRequest):
    count = ingest_drive_folder(req.drive_folder_url)
    return {"status": "success", "files_ingested": count}

@app.post("/api/chat")
async def chat(req: ChatRequest):
    return retrieve_answer(req.message)