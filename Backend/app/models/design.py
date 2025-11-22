from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, LargeBinary
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Design(Base):
    __tablename__ = "designs"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    content = Column(LargeBinary, nullable=False)          # use 'content' column
    content_type = Column(String, nullable=False)          # file mime type (like "image/png")
    is_processed = Column(Boolean, default=False)
    analysis_result = Column(String, nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="designs")
