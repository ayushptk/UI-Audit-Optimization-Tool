from app.ai.analyzer import extract_ai_description
from app.ai.model import analyze_with_ai
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
import os

router = APIRouter()

class AnalyzeRequest(BaseModel):
    filename: str


@router.get("/ai-analysis")
async def ai_analysis_get():
    return {
        "status": "ok",
        "message": "AI-analysis endpoint is running. Use POST to send filename."
    }


    
@router.post("/ai-analysis")
async def ai_analysis(request: AnalyzeRequest):
    filename = request.filename
    file_path = f"./uploads/{filename}"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    # Extract text + simple layout
    description = extract_ai_description(file_path)

    # Send to AI model
    ai_result = analyze_with_ai(description)

    # Save result to Frontend/app/output.json
    output_path = "../Frontend/app/output.json"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w") as f:
        json.dump({"ai_analysis": ai_result}, f)

    return {
        "ai_analysis": ai_result
    }
