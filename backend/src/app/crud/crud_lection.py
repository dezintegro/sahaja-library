from typing import List

from sqlalchemy import or_

from app.crud.base import CRUDBase
from app.models.lection import Lection
from app.schemas.lection import Lection as LectionScheme
from db.query.search import search_query
from db.session import Session


class CRUDLection(CRUDBase[Lection, LectionScheme, LectionScheme]):
    def search(self, db_session: Session, query: str) -> List[Lection]:
        return (
            db_session.query(Lection)
            .filter(
                or_(
                    Lection.title.ilike(f"%{query}%"),
                    Lection.content_ru.ilike(f"%{query}%"),
                )
            )
            .all()
        )

    def full_text_search(self, db_session: Session, query: str) -> List[Lection]:
        res = db_session.bind.execute(search_query, query=query, min_rank=0.3).fetchall()
        return res


lection = CRUDLection(Lection)
