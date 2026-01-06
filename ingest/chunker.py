from typing import List, Dict
import math

def chunk_text(
    documents: List[Dict],
    chunk_size: int = 500,
    overlap: int = 100
) -> List[Dict]:
    chunks = []

    for doc in documents:
        words = doc["text"].split()
        start = 0

        while start < len(words):
            end = start + chunk_size
            chunk_words = words[start:end]

            chunks.append({
                "text": " ".join(chunk_words),
                "source": doc.get("source"),
                "page": doc.get("page"),
                "start": start
            })

            start += chunk_size - overlap

    return chunks
