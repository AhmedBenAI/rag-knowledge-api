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

    index_path = PROCESSED_DIR / f"{user_id}.index"
    meta_path = PROCESSED_DIR / f"{user_id}_meta.pkl"

    if index_path.exists() and meta_path.exists():
        index = faiss.read_index(str(index_path))
        existing_meta: list[dict] = pickle.loads(meta_path.read_bytes())
        index.add(vectors)
        combined_meta = existing_meta + chunks
    else:
        index = faiss.IndexFlatL2(vectors.shape[1])
        index.add(vectors)
        combined_meta = chunks

    meta_path.write_bytes(pickle.dumps(combined_meta))
    faiss.write_index(index, str(index_path))
