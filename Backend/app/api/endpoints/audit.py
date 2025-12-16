from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.dependencies import get_db, get_current_user
from app.models.ai_analysis import AiAnalysis
from app.models.user import User

router = APIRouter()

@router.delete("/audit/{audit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_audit(
    audit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Find the audit analysis
    audit = db.query(AiAnalysis).filter(AiAnalysis.id == audit_id).first()
    
    if not audit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audit report not found"
        )
        
    # Ensure the audit belongs to the current user
    if audit.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this audit"
        )
        
    db.delete(audit)
    db.commit()
    return None
