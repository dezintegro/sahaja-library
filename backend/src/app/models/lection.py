from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    DateTime,
    func,
    Boolean,
    ForeignKey,
    Index,
)
from sqlalchemy.dialects.postgresql import TSVECTOR

from app.db.base_class import Base


class Lection(Base):

    __table_args__ = (
        Index("idx_gin_tsvector_ru", "tsvector_ru", postgresql_using="gin"),
    )

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    city = Column(String)
    country_id = Column(Integer, ForeignKey("country.id"), nullable=True)
    content_ru = Column(String)
    content_en = Column(String)
    date = Column(Date)
    is_public_program = Column(Boolean, nullable=False)
    has_video = Column(Boolean, nullable=False)
    has_audio = Column(Boolean, nullable=False)
    is_unknown_source = Column(Boolean, nullable=False, default=False)
    note = Column(String)

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    tsvector_ru = Column(TSVECTOR())

    # country = relationship("Country", back_populates="lections")
