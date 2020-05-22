from datetime import date
from typing import Optional

from pydantic import BaseModel, validator

LINE_SEPARATOR = '<br/>'
INDENT_SYMBOL = '&nbsp' * 8


# Shared properties
class LectionBase(BaseModel):
    id: int
    title: str
    content_ru: str
    city: Optional[str] = None
    country: Optional[str] = None
    date: Optional[date]


# Properties shared by models stored in DB
class LectionInDB(LectionBase):
    class Config:
        orm_mode = True


class Lection(LectionInDB):

    @validator("content_ru")
    def format_line_breaks(cls, v: str):
        return '{}{}'.format(INDENT_SYMBOL, v.replace('\n', f'{LINE_SEPARATOR}{INDENT_SYMBOL}'))
