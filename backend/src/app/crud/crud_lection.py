from typing import List, Optional

from sqlalchemy import or_

from app.crud.base import CRUDBase
from app.models.lection import Lection
from app.schemas.lection import Lection as LectionScheme
from app.db.query.lection import search_query, get_highlighted
from app.db.session import Session


class CRUDLection(CRUDBase[Lection, LectionScheme, LectionScheme]):

    def get_highlighted(self, db_session: Session, id: int, highlight: str) -> Optional[Lection]:
        res = db_session.bind.execute(get_highlighted, id=id, highlight=highlight).first()
        return res

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
        res = db_session.bind.execute(search_query, query=query, min_rank=0).fetchall()
        return res


lection = CRUDLection(Lection)
