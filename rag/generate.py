from openai import OpenAI

client = OpenAI()

def generate_answer(question, contexts):
    context_text = "\n".join([c["text"] for c in contexts])
    prompt = f"""Use only the context below to answer.
If unsure, say you do not know.

Context:
{context_text}

Question:
{question}
"""

    res = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    return res.choices[0].message.content