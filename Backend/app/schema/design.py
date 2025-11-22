from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DesignBase(BaseModel):
    filename: str
    content_type: str                       # add content_type here
    is_processed: bool = False
    analysis_result: Optional[str] = None

class DesignCreate(DesignBase):
    pass

class DesignResponse(DesignBase):
    id: int
    uploaded_at: datetime
    user_id: int

    class Config:
        orm_mode = True
