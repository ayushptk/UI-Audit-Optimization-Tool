from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schema.user import UserCreate, UserLogin, UserResponse
from app.models.user import User
from app.core.security import verify_password, hash_password, create_access_token


router = APIRouter(tags=["Auth"])

router = APIRouter(tags=["Auth"])


## suru ma user_data :Usercreate run hunxa validate garxa post data haru thik xa ki naii vanerw ani db = Depends(get_db) dependecy injection database connection garna help garxa 
@router.post("/register", response_model=UserResponse)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):

    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered."
        )

    # Create user
    new_user = User(
        name=user_data.username,
        email=user_data.email,
        password=hash_password(user_data.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login")
def login_user(user_data: UserLogin, db: Session = Depends(get_db)):

    # Check if user exists
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password.")

    # Validate password
    if not verify_password(user_data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password.")

    # Create JWT Token
    token = create_access_token({"user_id": user.id})

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "name": user.username, "email": user.email}
    }
    
