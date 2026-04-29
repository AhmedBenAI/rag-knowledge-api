import faiss
import pickle
import numpy as np
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

def retrieve(question, user_id, k=5):
    index = faiss.read_index(f"data/processed/{user_id}.index")

    with open(f"data/processed/{user_id}_meta.pkl", "rb") as f:
        meta = pickle.load(f)

    q_vec = model.encode([question], convert_to_numpy=True)
    _, I = index.search(q_vec, k)

    return [meta[i] for i in I[0]]
