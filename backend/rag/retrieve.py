from pathlib import Path
import pickle

import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
PROCESSED_DIR = Path("data/processed")


def retrieve(question: str, user_id: str, k: int = 5) -> list[dict]:
    index = faiss.read_index(str(PROCESSED_DIR / f"{user_id}.index"))
    meta: list[dict] = pickle.loads((PROCESSED_DIR / f"{user_id}_meta.pkl").read_bytes())

    q_vec = model.encode([question], convert_to_numpy=True)
    _, indices = index.search(q_vec, k)

    return [meta[i] for i in indices[0] if i < len(meta)]
