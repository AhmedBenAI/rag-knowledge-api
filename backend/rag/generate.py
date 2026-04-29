import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

SYSTEM_PROMPT = (
    "You are a helpful assistant. "
    "Answer the user's question using only the provided context. "
    "If the answer is not in the context, say \"I do not know\"."
)

def generate_answer(question: str, contexts: list[dict]) -> str:
    context_text = "\n\n".join(c["text"] for c in contexts)
    user_message = f"Context:\n{context_text}\n\nQuestion: {question}"

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message},
        ],
        temperature=0,
    )
    return response.choices[0].message.content
