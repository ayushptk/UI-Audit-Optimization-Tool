from sqlalchemy.orm import Session
from app.models.ai_analysis import AiAnalysis
from app.models.design import Design
from app.models.user import User


def create_analysis(db: Session, design: Design, user: User, result: dict) -> AiAnalysis:
    analysis = AiAnalysis(design_id=design.id, user_id=user.id, result=result)
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return analysis


def get_analyses_by_design(db: Session, design_id: int):
    return db.query(AiAnalysis).filter(AiAnalysis.design_id == design_id).order_by(AiAnalysis.created_at.desc()).all()


def get_latest_analysis_by_design(db: Session, design_id: int):
    return db.query(AiAnalysis).filter(AiAnalysis.design_id == design_id).order_by(AiAnalysis.created_at.desc()).first()
