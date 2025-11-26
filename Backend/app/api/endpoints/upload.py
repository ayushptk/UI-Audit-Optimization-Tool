from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.design import Design
from app.api.dependencies import get_current_user
from app.models.user import User
from app.schema.design import DesignResponse
import json

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@router.post("/upload", response_model=DesignResponse)
async def upload_design(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check file type validation (optional)
    allowed_extensions = [".fig", ".png", ".jpg", ".jpeg", ".svg"]
    filename = file.filename.lower()
    if not any(filename.endswith(ext) for ext in allowed_extensions):
        raise HTTPException(status_code=400, detail="File type not allowed")

    # Read file content
    content = await file.read()

    # Create Design instance and save to DB
    design = Design(
        filename=file.filename,          # <-- this is required!
        content=content,
        content_type=file.content_type,
        user_id=current_user.id,
        is_processed=False
    )
    db.add(design)
    db.commit()
    db.refresh(design)

    return design


@router.get("/designs")
async def list_designs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Return a list of designs (reports) for the current user."""
    designs = db.query(Design).filter(Design.user_id == current_user.id).order_by(Design.uploaded_at.desc()).all()
    results = []
    for d in designs:
        # Try to parse analysis_result as JSON, otherwise return as raw string
        analysis = None
        if d.analysis_result:
            try:
                analysis = json.loads(d.analysis_result)
            except Exception:
                analysis = d.analysis_result

        results.append({
            "id": d.id,
            "filename": d.filename,
            "is_processed": bool(d.is_processed),
            "uploaded_at": d.uploaded_at.isoformat() if d.uploaded_at is not None else None,
            "analysis_result": analysis,
        })

    return results
@router.get("/design/{design_id}")
async def get_design_image(
    design_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    design = db.query(Design).filter(Design.id == design_id, Design.user_id == current_user.id).first()
    if not design:
        raise HTTPException(status_code=404, detail="Design not found")

    return Response(content=design.content, media_type=design.content_type or "application/octet-stream")
