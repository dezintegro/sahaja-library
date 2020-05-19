from typing import List

from sqlalchemy import or_

from app.crud.base import CRUDBase
from app.models.lection import Lection
from app.schemas.lection import LectionPreview as LectionScheme
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


lection = CRUDLection(Lection)
