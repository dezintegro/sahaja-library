from datetime import date
from typing import Optional

from pydantic import BaseModel, validator


# Shared properties
class LectionBase(BaseModel):
    id: int
    title: str
    content_ru: str
    city: Optional[str] = None
    date: Optional[date]


# Properties shared by models stored in DB
class LectionInDB(LectionBase):
    class Config:
        orm_mode = True


# Properties to return to client
class LectionPreview(LectionInDB):
    @validator("content_ru")
    def strip_len(cls, v):
        return v[:200]


class Lection(LectionInDB):
    pass
