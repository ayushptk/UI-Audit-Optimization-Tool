from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schema.user import UserCreate, UserLogin, UserResponse
from app.models.user import User
from app.core.security import verify_password, hash_password, create_access_token
from app.api.dependencies import get_current_user
import requests


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

    # Validate password length before hashing
    if len(user_data.password.encode('utf-8')) > 72:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password cannot be longer than 72 bytes."
        )

    # Create user
    new_user = User(
        username=user_data.username,
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

@router.post("/google")
def google_auth(user_data: dict, db: Session = Depends(get_db)):
    token = user_data.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="Token is required")

    try:
        # Verify Google access token
        response = requests.get(f"https://www.googleapis.com/oauth2/v3/userinfo?access_token={token}")
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Invalid Google token")
        
        user_info = response.json()
        email = user_info.get("email")
        name = user_info.get("name")
        
        if not email:
            raise HTTPException(status_code=400, detail="Email not provided by Google")

        # Check if user exists
        user = db.query(User).filter(User.email == email).first()
        if not user:
            # Create new user
            username = name or email.split("@")[0]
            dummy_password = "oauth_placeholder"
            new_user = User(
                username=username,
                email=email,
                password=hash_password(dummy_password),
            )
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            user = new_user

        # Create JWT Token
        access_token = create_access_token({"user_id": user.id})

        return {
            "message": "Login successful via Google",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {"id": user.id, "name": user.username, "email": user.email}
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail="Google authentication failed")

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
