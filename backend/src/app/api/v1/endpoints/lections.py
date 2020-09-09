from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud
from app.api.utils.db import get_db
from schemas.lection import Lection

router = APIRouter()


@router.get("/", response_model=List[Lection])
def read_lections(
    db: Session = Depends(get_db), skip: int = 0, limit: int = 100,
):
    """
    Retrieve items.
    """
    return crud.lection.get_multi(db, skip=skip, limit=limit)


@router.get("/{id}", response_model=Lection)
def read_lection(
    *, db: Session = Depends(get_db), id: int, highlight: str
):
    """
    Get lection by ID.
    """
    if highlight:
        item = crud.lection.get_highlighted(db_session=db, id=id, highlight=highlight)
    else:
        item = crud.lection.get(db_session=db, id=id)

    if not item:
        raise HTTPException(status_code=404, detail="Lection not found")
    return item


@router.get("/search/{query}", response_model=List[Lection])
def search(
    *, db: Session = Depends(get_db), query: str,
):
    """
    Simple lections search.
    """
    lections = crud.lection.full_text_search(db_session=db, query=query)
    return lections
