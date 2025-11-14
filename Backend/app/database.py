import os
from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker, declarative_base,Session
from sqlalchemy import create_engine
load_dotenv()

db_url = os.getenv("DATABASE_URL")

engine = create_engine(db_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


Base = declarative_base()
