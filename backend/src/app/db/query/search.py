from sqlalchemy import text

search_query = text(
    """
        SELECT lection.id,
               title,
               ts_headline('russian', content_ru, q,
                           'StartSel = <span>, StopSel = </span>, MaxWords=75, MinWords=55')
                            as content_ru,
               date,
               city,
               country.name as country
        FROM lection
             LEFT JOIN country ON country.id = lection.country_id,
             plainto_tsquery('russian', :query) AS q,
             ts_rank(tsvector_ru, q) as rank
        WHERE tsvector_ru @@ q
          and rank > :min_rank
        ORDER BY rank DESC;
    """
)
