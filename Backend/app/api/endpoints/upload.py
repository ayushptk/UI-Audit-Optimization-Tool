import os
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@router.post("/upload")
async def upload_design(file: UploadFile = File(...), token: str = Depends(oauth2_scheme)):
    # Check file type validation (optional)
    allowed_extensions = [".fig", ".png", ".jpg", ".jpeg", ".svg"]
    filename = file.filename.lower()
    if not any(filename.endswith(ext) for ext in allowed_extensions):
        raise HTTPException(status_code=400, detail="File type not allowed")

    # Ensure uploads directory exists
    os.makedirs("./uploads", exist_ok=True)

    # Save uploaded file
    file_location = f"./uploads/{file.filename}"
    try:
        with open(file_location, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {e}")

    return {"filename": file.filename, "message": "File uploaded successfully"}
