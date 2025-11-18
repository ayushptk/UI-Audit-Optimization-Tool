import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()


genai.configure()
model = genai.GenerativeModel('gemini-2.5-flash')

def analyze_with_ai(description: str):
    from app.ai.prompts import UI_ANALYSIS_PROMPT

    response = model.generate_content([
        UI_ANALYSIS_PROMPT,
        description
    ])

    return response.text
