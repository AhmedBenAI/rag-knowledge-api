import tiktoken
from typing import List, Dict

encoding = tiktoken.get_encoding("cl100k_base")

def chunk_text(documents: List[Dict], chunk_size=500, overlap=100) -> List[Dict]:
    chunks = []
    for doc in documents:
        tokens = encoding.encode(doc["text"])
        start = 0
        while start < len(tokens):
            end = start + chunk_size
            chunk_tokens = tokens[start:end]
            chunks.append({
                "text": encoding.decode(chunk_tokens),
                "source": doc.get("source"),
                "chunk_start": start
            })
            start += chunk_size - overlap
    return chunks