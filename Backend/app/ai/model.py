import os
import json
import re
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()


genai.configure()
model = genai.GenerativeModel('gemini-2.5-flash')


def _extract_json_from_text(text: str) -> str | None:
    """Try to extract a JSON object or array from the given text.
    Returns the JSON string if found, otherwise None.
    """
    if not isinstance(text, str):
        return None

    # Try direct parse first
    try:
        json.loads(text)
        return text
    except Exception:
        pass

    # Try fenced code block (```json ... ```)
    fence_re = re.compile(r"```(?:json)?\s*([\s\S]*?)\s*```", re.I)
    m = fence_re.search(text)
    if m:
        candidate = m.group(1).strip()
        try:
            json.loads(candidate)
            return candidate
        except Exception:
            pass

    # Fallback: find the first { and the last } (or [ and ]) and attempt to parse
    # Prefer object
    start = text.find('{')
    end = text.rfind('}')
    if start != -1 and end != -1 and end > start:
        candidate = text[start:end+1]
        try:
            json.loads(candidate)
            return candidate
        except Exception:
            pass

    # Try array
    start = text.find('[')
    end = text.rfind(']')
    if start != -1 and end != -1 and end > start:
        candidate = text[start:end+1]
        try:
            json.loads(candidate)
            return candidate
        except Exception:
            pass

    return None


def analyze_with_ai(description: str) -> dict:
    """Send description to the AI model and return a parsed dict result.

    The underlying model is expected to return JSON only (per prompt). This function
    attempts to parse the model output robustly and returns a Python dict. If parsing
    fails, an attempt is made to return a minimal fallback structure.
    """
    from app.ai.prompts import UI_ANALYSIS_PROMPT

    response = model.generate_content([
        UI_ANALYSIS_PROMPT,
        description
    ])

    raw = getattr(response, 'text', None) or str(response)

    # Try to extract JSON
    json_str = _extract_json_from_text(raw)
    if json_str:
        try:
            return json.loads(json_str)
        except Exception:
            pass

    # As a last resort, try to coerce simple key/value lines into a dict (very small fallback)
    # But prefer returning something predictable for storage
    return {
        "kpi": {
            "overall": 0,
            "typography": 0,
            "spacing": 0,
            "color": 0,
            "layout": 0,
            "visual_hierarchy": 0,
            "accessibility": 0,
            "usability": 0
        },
        "kpi_details": {},
        "good": [],
        "issues": ["AI response could not be parsed as JSON"],
        "suggestions": [raw[:1000]]
    }
