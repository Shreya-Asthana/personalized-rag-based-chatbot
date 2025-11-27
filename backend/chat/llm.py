import os
import requests
import json


GROQ_API_KEY = os.getenv("LLM_API_KEY")
GROQ_API_URL = os.getenv("LLM_API_URL")
GROQ_MODEL = os.getenv("LLM_MODEL", "llama-3.1-8b-instant")

def generate_answer(question, context):
    prompt = f"""
    Use the following context to answer:

    {context}

    Question: {question}

    Provide a clear answer with references.
    """
    if not GROQ_API_KEY:
            raise RuntimeError("GROQ_API_KEY environment variable not set.")

    headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

    payload = {
            "model": GROQ_MODEL,
            "messages": [
                {"role": "system", "content": "You are a helpful AI assistant."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.0,
            "max_tokens": 300
        }

    response = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=60)
    response.raise_for_status()
    data = response.json()

    # Extract output text
    try:
        text = data["choices"][0]["message"]["content"]
        return text
    except (KeyError, IndexError):
        return json.dumps(data)