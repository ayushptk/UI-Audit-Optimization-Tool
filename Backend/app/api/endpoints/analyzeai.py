from app.ai.analyzer import extract_ai_description
from app.ai.model import analyze_with_ai
from fastapi import APIRouter, HTTPException, Depends, Response
from pydantic import BaseModel
from sqlalchemy.orm import Session
import os
import json
from app.api.dependencies import get_db, get_current_user
from app.models.design import Design
from app.models.user import User

router = APIRouter()

class AnalyzeRequest(BaseModel):
    design_id: int


@router.get("/ai-analysis")
async def ai_analysis_get():
    return {
        "status": "ok",
        "message": "AI-analysis endpoint is running. Use POST to send design_id."
    }


    
@router.post("/ai-analysis")
async def ai_analysis(
    request: AnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    design = db.query(Design).filter(
        Design.id == request.design_id,
        Design.user_id == current_user.id
    ).first()

    if not design:
        raise HTTPException(status_code=404, detail="Design not found or access denied")

    # Save binary content temporarily
    temp_dir = "./uploads"
    os.makedirs(temp_dir, exist_ok=True)
    temp_path = os.path.join(temp_dir, f"temp_{design.id}.png")
    with open(temp_path, "wb") as f:
        f.write(design.content)

    # Extract text + simple layout
    description = extract_ai_description(temp_path)

    # Remove temp file
    os.remove(temp_path)

    # Send to AI model
    ai_result = analyze_with_ai(description)

    # Save analysis result in DB
    design.is_processed = True
    design.analysis_result = ai_result
    db.commit()

    # Save result to Frontend/app/output.json
    output_path = "../Frontend/app/output.json"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w") as f:
        json.dump({"ai_analysis": ai_result}, f)

    return {
        "ai_analysis": ai_result
    }
