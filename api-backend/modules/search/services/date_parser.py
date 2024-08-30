from typing import Optional

from natasha import MorphVocab
from natasha.extractors import Extractor
from natasha.grammars.date import (
    Date,
    DAY,
    MONTH,
    YEAR,
    YEAR_SHORT,
    YEAR_WORD,
    MONTH_NAME,
)
from yargy import rule, or_

DATA_DELIMITER = or_(
    rule("."),
    rule("/"),
    rule(" "),
    rule(":"),
    rule("-"),
).optional()

DATE = or_(
    rule(
        DAY,
        DATA_DELIMITER,
        MONTH,
        DATA_DELIMITER,
        or_(YEAR, YEAR_SHORT),
        YEAR_WORD.optional(),
    ),
    rule(YEAR, YEAR_WORD.optional()),
    rule(DAY, MONTH_NAME),
    rule(MONTH_NAME, YEAR, YEAR_WORD.optional()),
    rule(DAY, MONTH_NAME, YEAR, YEAR_WORD.optional()),
).interpretation(Date)


class DatesExtractor(Extractor):
    def __init__(self, morph):
        Extractor.__init__(self, DATE, morph)


def _parse_date(query: str) -> Optional[Date]:
    morph_vocab = MorphVocab()
    dates_extractor = DatesExtractor(morph_vocab)
    result = list(dates_extractor(query))
    return result[0] if result else None


def _remove_date(query: str, date: Date) -> str:
    return f"{query[:date.start]}{query[date.stop:]}"


def extract_date(query_str):
    date_entity = _parse_date(query_str)
    if date_entity:
        query_str = _remove_date(query_str, date_entity)
    return query_str, date_entity
