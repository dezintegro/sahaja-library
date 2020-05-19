from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud
from app.api.utils.db import get_db
from schemas.lection import LectionPreview, Lection

router = APIRouter()


@router.get("/", response_model=List[LectionPreview])
def read_items(
    db: Session = Depends(get_db), skip: int = 0, limit: int = 100,
):
    """
    Retrieve items.
    """
    return crud.lection.get_multi(db, skip=skip, limit=limit)


@router.get("/{id}", response_model=Lection)
def read_item(
    *, db: Session = Depends(get_db), id: int,
):
    """
    Get lection by ID.
    """
    item = crud.lection.get(db_session=db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Lection not found")
    return item


@router.get("/search/{query}", response_model=List[LectionPreview])
def read_item(
    *, db: Session = Depends(get_db), query: str,
):
    """
    Simple lections search.
    """
    lections = crud.lection.search(db_session=db, query=query)
    return lections
