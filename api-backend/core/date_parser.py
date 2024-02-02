from typing import Optional

from natasha import MorphVocab
from natasha.extractors import Extractor
from natasha.grammars.date import Date
from yargy import rule, and_, or_
from yargy.predicates import (
    eq,
    gte,
    lte,
    length_eq,
    dictionary,
    normalized,
)

MONTHS = {
    "январь": 1,
    "февраль": 2,
    "март": 3,
    "апрель": 4,
    "май": 5,
    "июнь": 6,
    "июль": 7,
    "август": 8,
    "сентябрь": 9,
    "октябрь": 10,
    "ноябрь": 11,
    "декабрь": 12,
}


MONTH_NAME = dictionary(MONTHS).interpretation(
    Date.month.normalized().custom(MONTHS.__getitem__)
)

MONTH = and_(gte(1), lte(12)).interpretation(Date.month.custom(int))

DAY = and_(gte(1), lte(31)).interpretation(Date.day.custom(int))

YEAR_WORD = or_(rule("г", eq(".").optional()), rule(normalized("год")))

YEAR = and_(gte(1000), lte(2100)).interpretation(Date.year.custom(int))

YEAR_SHORT = and_(length_eq(2), gte(0), lte(99)).interpretation(
    Date.year.custom(lambda _: 1900 + int(_))
)

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


def extract_date(query: str) -> Optional[Date]:
    morph_vocab = MorphVocab()
    dates_extractor = DatesExtractor(morph_vocab)
    result = list(dates_extractor(query))
    return result[0] if result else None


def remove_date(query: str, date: Date) -> str:
    return f"{query[:date.start]}{query[date.stop:]}"
