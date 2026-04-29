import requests

OLLAMA_URL = "http://localhost:11434/api/generate"

def generate_answer(question, contexts):
    context_text = "\n".join([c["text"] for c in contexts])

    prompt = f"""
Use only the context below to answer.
If the answer is not contained in the context, say "I do not know".

Context:
{context_text}

Question:
{question}
"""

    payload = {
        "model": "phi3:mini",
        "prompt": prompt,
        "stream": False
    }

    r = requests.post(OLLAMA_URL, json=payload, timeout=60)
    return r.json()["response"]
