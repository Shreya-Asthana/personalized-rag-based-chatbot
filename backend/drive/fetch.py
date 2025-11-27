import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from backend.processors.extract import extract_text
from backend.utils.chunking import chunk_text
from backend.embedding.gemini_embed import embed
from backend.vectorstore.chroma_store import store_chunks

def extract_id(url):
    last = url.split('/')[-1]
    return last.split('?')[0]  # remove query parameters


def ingest_drive_folder(url):
    folder_id = extract_id(url)

    SCOPES = ["https://www.googleapis.com/auth/drive"]
    
    service_json_path = os.path.join(os.path.dirname(__file__), '..', '..', 'service.json')
    
    if not os.path.exists(service_json_path):
        raise FileNotFoundError(f"service.json not found at {service_json_path}")
    
    creds = service_account.Credentials.from_service_account_file(
        service_json_path, scopes=SCOPES
    )
    service = build("drive", "v3", credentials=creds)

    results = service.files().list(q=f"'{folder_id}' in parents").execute()
    files = results.get("files", [])

    os.makedirs("downloads", exist_ok=True)
    count = 0

    for f in files:
        request = service.files().get_media(fileId=f["id"])
        filepath = f"downloads/{f['name']}"

        with open(filepath, "wb") as fp:
            from googleapiclient.http import MediaIoBaseDownload
            import io
            downloader = MediaIoBaseDownload(fp, request)
            done = False
            while not done:
                status, done = downloader.next_chunk()

        text = extract_text(filepath)
        chunks = chunk_text(text)

        for c in chunks:
            store_chunks(f["name"], c, embed(c))

        count += 1

    return count