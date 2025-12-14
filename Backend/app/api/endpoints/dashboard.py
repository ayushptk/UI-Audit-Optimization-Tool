from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any
from app.api.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.design import Design
from app.models.ai_analysis import AiAnalysis
import json
from datetime import datetime

router = APIRouter()

@router.get("/dashboard/stats")
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Total Designs
    total_designs = db.query(Design).filter(Design.user_id == current_user.id).count()

    # 2. Total Audit Reports (Analyses)
    # Join with Design to ensure we only count current user's analyses
    total_audits = db.query(AiAnalysis).join(Design).filter(Design.user_id == current_user.id).count()

    # Fetch all analyses for further processing
    analyses = db.query(AiAnalysis).join(Design).filter(Design.user_id == current_user.id).order_by(AiAnalysis.created_at.desc()).all()

    avg_score = 0
    kpi_sums = {
        "typography": 0, "spacing": 0, "color": 0, "layout": 0, 
        "visual_hierarchy": 0, "accessibility": 0, "usability": 0
    }
    kpi_counts = {k: 0 for k in kpi_sums}
    
    score_trend = []
    
    valid_audits_count = 0
    
    for analysis in analyses:
        result = analysis.result
        # Handle stringified JSON if necessary
        if isinstance(result, str):
            try:
                result = json.loads(result)
            except:
                continue
        
        # Ensure result is a dict and has "kpi"
        if not isinstance(result, dict):
            continue

        kpi = result.get("kpi", {})
        if not isinstance(kpi, dict):
            kpi = {}

        # Handle score extraction with fallback and type safety
        raw_score = kpi.get("overall", kpi.get("overall_score", 0))
        try:
            overall = int(float(raw_score))
        except (ValueError, TypeError):
            overall = 0
        
        avg_score += overall
        valid_audits_count += 1
        
        # Trend data
        formatted_date = analysis.created_at.strftime("%Y-%m-%d") if analysis.created_at else ""
        score_trend.append({
            "date": formatted_date,
            "score": overall
        })
        
        # Category Breakdown accumulation
        for key in kpi_sums:
            if key in kpi:
                kpi_sums[key] += kpi[key]
                kpi_counts[key] += 1

    final_avg_score = round(avg_score / valid_audits_count) if valid_audits_count > 0 else 0
    
    category_breakdown = {}
    for key, total in kpi_sums.items():
        count = kpi_counts[key]
        category_breakdown[key] = round(total / count) if count > 0 else 0

    # Recent Audits (top 5)
    recent_audits_data = []
    for analysis in analyses[:5]:
        result = analysis.result
        if isinstance(result, str):
            try: result = json.loads(result)
            except: result = {}
        
        overall = result.get("kpi", {}).get("overall", 0)
            
        recent_audits_data.append({
            "id": analysis.id,
            "design_name": analysis.design.filename,  # Assuming relation is 'design'
            "overall_score": overall,
            "date": analysis.created_at.isoformat(),
            "status": "Completed"
        })

    return {
        "total_designs": total_designs,
        "audit_reports": total_audits,
        "avg_score": final_avg_score,
        "ui_score_trend": score_trend[::-1], # Reverse so it's chronological (oldest -> newest)
        "category_breakdown": category_breakdown,
        "recent_audits": recent_audits_data
    }
