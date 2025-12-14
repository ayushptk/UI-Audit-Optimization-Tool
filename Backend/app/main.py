from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models.user import User
from app.database import engine, Base
from app.api.endpoints import auth
from app.api.endpoints import upload
from app.api.endpoints.analyze import router as analyze_router
from app.api.endpoints import analyzeai
from app.api.endpoints import dashboard
app = FastAPI(title="UIaudit Backend API")
Base.metadata.create_all(bind=engine)

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    
)

app.include_router(auth.router, prefix="/auth")
app.include_router(upload.router, prefix="/api")
app.include_router(analyze_router, prefix="/api")
app.include_router(analyzeai.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")


@app.get("/")
def root():
    
    return {"message": "Welcome to UIaudit API"}
