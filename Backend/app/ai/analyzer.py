import base64
import google.generativeai as genai
from PIL import Image
import os
import io
from dotenv import load_dotenv


load_dotenv()


def extract_ai_description(file_path: str):
    """Convert UI image into text description for AI."""
    img = Image.open(file_path)
    width, height = img.size

    # Encode image to base64
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()

    genai.configure()
    model = genai.GenerativeModel('gemini-2.5-flash')

    response = model.generate_content([
        "Extract all visible text from this UI screenshot. Provide only the extracted text, nothing else.",
        {"mime_type": "image/png", "data": img_str}
    ])

    text = response.text

    return f"""
    Screen size: {width}x{height}
    Extracted text: {text}
    """
