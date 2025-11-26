from app.ai.analyzer import extract_ai_description
from app.ai.model import analyze_with_ai
from fastapi import APIRouter, HTTPException, Depends, Response, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
import os
import json
from typing import List, Optional
from app.api.dependencies import get_db, get_current_user
from app.models.design import Design
from app.models.user import User
from app.schema.ai_analysis import AiAnalysisRead
from app.services.ai_service import create_analysis, get_analyses_by_design


router = APIRouter()

class AnalyzeRequest(BaseModel):
    design_id: int


@router.get("/ai-analysis")
async def ai_analysis_get(design_id: Optional[int] = Query(None), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """If `design_id` is provided returns analyses for that design (owned by current user)."""
    if design_id is None:
        return {"status": "ok", "message": "AI-analysis endpoint is running. Use POST to send design_id."}

    # Ensure design belongs to user
    design = db.query(Design).filter(Design.id == design_id, Design.user_id == current_user.id).first()
    if not design:
        raise HTTPException(status_code=404, detail="Design not found or access denied")

    analyses = get_analyses_by_design(db, design_id)
    return [AiAnalysisRead.from_orm(a) for a in analyses]


    
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

    # Save analysis result in a dedicated table
    analysis_record = create_analysis(db, design, current_user, ai_result)

    # Keep design flag + a JSON string snapshot for backward compatibility
    design.is_processed = True
    try:
        design.analysis_result = json.dumps(ai_result)
    except Exception:
        # Fallback: store string representation
        design.analysis_result = str(ai_result)
    db.commit()

    # Optionally keep storing the frontend local file (not required)
    output_path = "../Frontend/app/output.json"
    try:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, "w") as f:
            json.dump({"ai_analysis": ai_result}, f)
    except Exception:
        pass

    return AiAnalysisRead.from_orm(analysis_record)
