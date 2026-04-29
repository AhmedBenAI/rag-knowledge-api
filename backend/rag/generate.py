import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

SYSTEM_PROMPT = """\
You are an expert UK employment law assistant. Answer questions using only \
the provided context, which is drawn from official sources such as GOV.UK \
and ACAS.

Rules:
- Cite the source document in your answer (e.g. "According to ACAS..." \
or "GOV.UK states...").
- If the answer is not in the provided context, say: "I don't have enough \
information in my knowledge base to answer this confidently. For authoritative \
guidance visit gov.uk or acas.org.uk, or call ACAS free on 0300 123 1100."
- Use plain English. Avoid legal jargon where possible.
- End every answer with this disclaimer on its own line: \
"⚠ This is general information only, not legal advice. For your specific \
situation, consult an employment solicitor or contact ACAS."
"""


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
