# UK Employment Law API

FastAPI backend for the UK Employment Law Assistant. Ingests GOV.UK and ACAS documents, stores them in a FAISS vector index, and answers employment law questions via GPT-3.5-Turbo.

**Frontend repo:** [rag-knowledge-web](https://github.com/PotatoUser69/rag-knowledge-web)

## Project structure

```
rag-knowledge-api/
├── backend/
│   ├── api/main.py           # REST endpoints + CORS
│   ├── rag/
│   │   ├── generate.py       # GPT-3.5 answer generation
│   │   └── retrieve.py       # FAISS vector search
│   ├── ingest/
│   │   ├── loader.py         # PDF + URL loaders
│   │   ├── chunker.py        # Text chunking
│   │   └── embed.py          # Embeddings (appends to index)
│   ├── seed.py               # One-time knowledge base seeder
│   ├── requirements.txt
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

## Prerequisites

- An [OpenAI API key](https://platform.openai.com/api-keys)
- **Docker** — for the production setup
- **Python 3.11** — for local development

---

## Option A — Docker

```bash
cp .env.example .env
# Edit .env — set OPENAI_API_KEY and CORS_ORIGINS

docker compose up --build
# API: http://localhost:8000
# Docs: http://localhost:8000/docs
```

Seed the knowledge base (once, while the container is running):

```bash
docker compose exec backend python seed.py
```

---

## Option B — Local development

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

Seed the knowledge base (once, with the venv active):

```bash
python seed.py
# Scrapes 24 GOV.UK + ACAS pages — takes ~2 minutes
# Re-seed from scratch: python seed.py --force
```

---

## Deploy to Railway

1. Push this repo to GitHub
2. Create a new project in [Railway](https://railway.app) → **Deploy from GitHub repo**
3. Add environment variables: `OPENAI_API_KEY`, `CORS_ORIGINS=https://raf-knowledge.ahmed-ai.com`
4. Railway detects `docker-compose.yml` and deploys automatically
5. After deploy, open a shell and run `python seed.py` to seed the knowledge base

---

## How it works

1. **Seed** — `seed.py` scrapes 24 GOV.UK + ACAS pages and stores them as a FAISS vector index under `data/`.
2. **Ingest** — PDFs or URLs uploaded via the API are appended to the same index.
3. **Retrieve** — Questions are embedded and the top-5 nearest chunks are fetched.
4. **Generate** — Chunks are passed to GPT-3.5-Turbo with a prompt requiring source citation and a legal disclaimer.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | Your OpenAI secret key (`sk-...`) |
| `CORS_ORIGINS` | No | Comma-separated allowed origins. Defaults to `*` |

## Disclaimer

This tool provides general information only, not legal advice. For specific situations, consult an employment solicitor or contact ACAS on **0300 123 1100**.
