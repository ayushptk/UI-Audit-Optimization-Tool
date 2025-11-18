import os
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()

client = OpenAI()

def analyze_with_ai(description: str):
    from app.ai.prompts import UI_ANALYSIS_PROMPT
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": UI_ANALYSIS_PROMPT},
            {"role": "user", "content": description}
        ]
    )

    return response.choices[0].message["content"]
