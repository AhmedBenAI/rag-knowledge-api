# RAG Knowledge API

A full-stack Retrieval-Augmented Generation (RAG) application. Upload PDFs or web pages, then ask questions and get answers grounded in your documents — powered by OpenAI GPT-3.5-Turbo.

## Project structure

```
rag-knowledge-api/
├── backend/                  # FastAPI application
│   ├── api/main.py           # REST endpoints
│   ├── rag/
│   │   ├── generate.py       # OpenAI GPT-3.5 answer generation
│   │   └── retrieve.py       # FAISS vector search
│   ├── ingest/
│   │   ├── loader.py         # PDF + URL loaders
│   │   ├── chunker.py        # Text chunking
│   │   └── embed.py          # Sentence-transformer embeddings
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                 # Angular 17 SPA
│   ├── src/app/
│   │   ├── pages/upload/     # Knowledge Base page (PDF + URL upload)
│   │   ├── pages/chat/       # Ask AI chat page
│   │   └── services/         # HTTP API service
│   ├── nginx.conf            # Reverse-proxy config (production)
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/upload/pdf` | Index a PDF (`multipart/form-data`: `user_id`, `file`) |
| `POST` | `/upload/url` | Index a web page (`{ user_id, url }`) |
| `POST` | `/ask` | Ask a question (`{ user_id, question }`) |

Each user's knowledge base is isolated by `user_id`.

## Prerequisites

- An [OpenAI API key](https://platform.openai.com/api-keys)
- **Docker** — for the production setup
- **Python 3.11** + **Node 20** — for local development

---

## Option A — Docker (recommended)

```bash
cp .env.example .env
# Edit .env and set your OPENAI_API_KEY

docker compose up --build
```

The Angular UI is served at **http://localhost**. All `/api/*` requests are proxied to the backend by nginx automatically.

---

## Option B — Local development

**Backend** (runs from the `backend/` folder so Python imports resolve correctly)

```bash
cd backend
python -m venv venv
source venv/Scripts/activate   # Windows
# source venv/bin/activate     # macOS / Linux
pip install -r requirements.txt

uvicorn api.main:app --reload
# API:   http://localhost:8000
# Docs:  http://localhost:8000/docs
```

**Frontend** (proxies `/api` → `http://localhost:8000`)

```bash
cd frontend
npm install
npm start
# UI: http://localhost:4200
```

---

## How it works

1. **Ingest** — Documents are loaded (PDF pages or scraped HTML), split into 500-word overlapping chunks, and embedded with `all-MiniLM-L6-v2`. Vectors are stored in a per-user FAISS index under `backend/data/`.
2. **Retrieve** — The question is embedded and the top-5 nearest chunks are fetched from the user's index.
3. **Generate** — Retrieved chunks are passed as context to GPT-3.5-Turbo with a system prompt that prevents answers outside the provided context.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | Your OpenAI secret key (`sk-...`) |
