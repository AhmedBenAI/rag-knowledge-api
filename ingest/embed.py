import faiss
import pickle
import numpy as np
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_chunks(chunks, user_id):
    texts = [c["text"] for c in chunks]
    vectors = model.encode(texts, convert_to_numpy=True)

    index = faiss.IndexFlatL2(vectors.shape[1])
    index.add(vectors)

    with open(f"data/processed/{user_id}_meta.pkl", "wb") as f:
        pickle.dump(chunks, f)

    faiss.write_index(index, f"data/processed/{user_id}.index")
