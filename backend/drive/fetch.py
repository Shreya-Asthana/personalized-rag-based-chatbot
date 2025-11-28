import os
import tempfile
import shutil
from google.oauth2 import service_account
from googleapiclient.discovery import build
from backend.processors.extract import extract_text
from backend.utils.chunking import chunk_text
from backend.embedding.embedding import embed
from backend.vectorstore.chroma_store import store_chunks, init_vectorstore


def extract_id(url):
    last = url.split('/')[-1]
    return last.split('?')[0]


def ingest_drive_folder(url):
    import json
    folder_id = extract_id(url)

    # Reset vector store snapshot before ingestion
    init_vectorstore()

    yield json.dumps({"status": "info", "message": "Authenticating with Google Drive..."}) + "\n"

    SCOPES = ["https://www.googleapis.com/auth/drive"]
    
    service_json_path = os.path.join(os.path.dirname(__file__), '..', '..', 'service.json')
    
    if not os.path.exists(service_json_path):
        yield json.dumps({"status": "error", "message": "service.json not found"}) + "\n"
        return

    creds = service_account.Credentials.from_service_account_file(
        service_json_path, scopes=SCOPES
    )
    service = build("drive", "v3", credentials=creds)

    yield json.dumps({
        "status": "info",
        "message": f"Listing files in folder {folder_id}..."
    }) + "\n"

    results = service.files().list(q=f"'{folder_id}' in parents").execute()
    files = results.get("files", [])

    if not files:
        yield json.dumps({
            "status": "warning",
            "message": "No files found in the folder."
        }) + "\n"
        return

    yield json.dumps({
        "status": "info",
        "message": f"Found {len(files)} files. Starting download..."
    }) + "\n"

    # Create a temporary directory for downloads
    temp_dir = tempfile.mkdtemp(prefix="drive_ingest_")
    count = 0

    try:
        for f in files:
            yield json.dumps({
                "status": "progress",
                "message": f"Downloading {f['name']}..."
            }) + "\n"

            request = service.files().get_media(fileId=f["id"])
            filepath = os.path.join(temp_dir, f["name"])

            from googleapiclient.http import MediaIoBaseDownload
            import io

            with open(filepath, "wb") as fp:
                downloader = MediaIoBaseDownload(fp, request)
                done = False
                while not done:
                    status, done = downloader.next_chunk()

            yield json.dumps({
                "status": "progress",
                "message": f"Processing {f['name']}..."
            }) + "\n"

            # Extract text
            text = extract_text(filepath)

            # Chunk text
            chunks = chunk_text(text)

            # Store chunks with embeddings
            for c in chunks:
                store_chunks(f["name"], c, embed(c))

            # Delete file immediately after processing
            try:
                os.remove(filepath)
            except Exception:
                pass

            count += 1

            yield json.dumps({
                "status": "success",
                "message": f"Completed {f['name']}"
            }) + "\n"

    finally:
        # Delete the whole temp directory after ingestion
        shutil.rmtree(temp_dir, ignore_errors=True)

    yield json.dumps({
        "status": "completed",
        "message": "Ingestion complete.",
        "files_ingested": count
    }) + "\n"
