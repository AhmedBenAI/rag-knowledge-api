import faiss, pickle, numpy as np
from openai import OpenAI

client = OpenAI()

def retrieve(question, user_id, k=5):
    index = faiss.read_index(f"data/processed/{user_id}.index")
    with open(f"data/processed/{user_id}_meta.pkl", "rb") as f:
        meta = pickle.load(f)

    q_emb = client.embeddings.create(
        model="text-embedding-3-small",
        input=question
    ).data[0].embedding

    D, I = index.search(np.array([q_emb]).astype("float32"), k)
    return [meta[i] for i in I[0]]