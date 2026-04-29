from pathlib import Path

import faiss
import numpy as np
import pickle
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
PROCESSED_DIR = Path("data/processed")


def embed_chunks(chunks: list[dict], user_id: str) -> None:
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

    texts = [c["text"] for c in chunks]
    vectors = model.encode(texts, convert_to_numpy=True)

    index = faiss.IndexFlatL2(vectors.shape[1])
    index.add(vectors)

    (PROCESSED_DIR / f"{user_id}_meta.pkl").write_bytes(pickle.dumps(chunks))
    faiss.write_index(index, str(PROCESSED_DIR / f"{user_id}.index"))
