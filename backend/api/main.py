from fastapi import FastAPI, UploadFile, Form
from ingest.loader import load_pdfs, load_url
from ingest.chunker import chunk_text
from ingest.embed import embed_chunks
from rag.retrieve import retrieve
from rag.generate import generate_answer

app = FastAPI()

@app.post("/upload/pdf")
async def upload_pdf(user_id: str = Form(...), file: UploadFile = Form(...)):
    path = f"data/raw/{file.filename}"
    with open(path, "wb") as f:
        f.write(await file.read())

    docs = load_pdfs("data/raw")
    chunks = chunk_text(docs)
    embed_chunks(chunks, user_id)

    return {"status": "pdf indexed"}

@app.post("/upload/url")
def upload_url(user_id: str, url: str):
    doc = load_url(url)
    chunks = chunk_text([doc])
    embed_chunks(chunks, user_id)
    return {"status": "url indexed"}

@app.post("/ask")
def ask(user_id: str, question: str):
    contexts = retrieve(question, user_id)
    answer = generate_answer(question, contexts)
    return {"answer": answer}
