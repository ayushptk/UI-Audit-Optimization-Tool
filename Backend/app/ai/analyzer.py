import base64
from openai import OpenAI
from PIL import Image
import os
import io 

def extract_ai_description(file_path: str):
    """Convert UI image into text description for AI."""
    img = Image.open(file_path)
    width, height = img.size

    # Encode image to base64
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Extract all visible text from this UI screenshot. Provide only the extracted text, nothing else."},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/png;base64,{img_str}"},
                    },
                ],
            }
        ],
    )

    text = response.choices[0].message.content

    return f"""
    Screen size: {width}x{height}
    Extracted text: {text}
    """
