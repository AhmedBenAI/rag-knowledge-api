import os
from pathlib import Path

from dotenv import load_dotenv, find_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv(find_dotenv(raise_error_if_not_found=False))

from ingest.chunker import chunk_text
from ingest.embed import embed_chunks
from ingest.loader import load_pdf, load_url
from rag.generate import generate_answer
from rag.retrieve import retrieve

RAW_DIR = Path("data/raw")
PROCESSED_DIR = Path("data/processed")
RAW_DIR.mkdir(parents=True, exist_ok=True)
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="UK Employment Law API", version="1.0.0")

_origins = os.getenv("CORS_ORIGINS", "*")
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins.split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


class UrlRequest(BaseModel):
    user_id: str
    url: str


class AskRequest(BaseModel):
    user_id: str
    question: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/upload/pdf")
async def upload_pdf(user_id: str = Form(...), file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    dest = RAW_DIR / file.filename
    dest.write_bytes(await file.read())

    docs = load_pdf(str(dest))
    if not docs:
        raise HTTPException(status_code=422, detail="Could not extract text from PDF.")

    chunks = chunk_text(docs)
    embed_chunks(chunks, user_id)
    return {"status": "indexed", "chunks": len(chunks), "source": file.filename}


@app.post("/upload/url")
def upload_url(body: UrlRequest):
    try:
        doc = load_url(body.url)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Failed to load URL: {exc}")

    chunks = chunk_text([doc])
    embed_chunks(chunks, body.user_id)
    return {"status": "indexed", "chunks": len(chunks), "source": body.url}


@app.post("/ask")
def ask(body: AskRequest):
    index_path = PROCESSED_DIR / f"{body.user_id}.index"
    if not index_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"No knowledge base found for user '{body.user_id}'. Upload documents first.",
        )

    contexts = retrieve(body.question, body.user_id)
    answer = generate_answer(body.question, contexts)

    sources = list({c["source"] for c in contexts if c.get("source")})
    return {"answer": answer, "sources": sources}
