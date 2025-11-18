from app.ai.analyzer import extract_ai_description
from app.ai.model import analyze_with_ai
from fastapi import APIRouter,UploadFile
from app.services.file_service import save_uploaded_file

router = APIRouter()

@router.post("/ai-analysis")
async def ai_analysis(file: UploadFile):
    file_path = save_uploaded_file(file)

    # Extract text + simple layout
    description = extract_ai_description(file_path)

    # Send to AI model
    ai_result = analyze_with_ai(description)

    return {
        "ai_analysis": ai_result
    }
