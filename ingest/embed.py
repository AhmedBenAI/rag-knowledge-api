import os
import faiss
import pickle
from openai import OpenAI

client = OpenAI()

def embed_chunks(chunks, user_id):
    vectors = []
    texts = []
    for c in chunks:
        res = client.embeddings.create(
            model="text-embedding-3-small",
            input=c["text"]
        )
        vectors.append(res.data[0].embedding)
        texts.append(c)

    dim = len(vectors[0])
    index = faiss.IndexFlatL2(dim)
    index.add(np.array(vectors).astype("float32"))

    with open(f"data/processed/{user_id}_meta.pkl", "wb") as f:
        pickle.dump(texts, f)
    faiss.write_index(index, f"data/processed/{user_id}.index")