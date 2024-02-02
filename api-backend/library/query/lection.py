from sqlalchemy import text

search_query = text(
    """
        SELECT lection.id,
               title,
               ts_headline('russian', content_ru, q,
                           'StartSel = "<span class=""highlight"">", StopSel = </span>, MaxWords=75, MinWords=55')
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

get_highlighted = text(
    """
        SELECT lection.id,
               title,
               ts_headline('russian', content_ru, 
                            plainto_tsquery('russian', :highlight),
                           'StartSel = "<span class=""highlight"">", StopSel = </span>, HighlightAll=true')
                            as content_ru,
               date,
               city,
               country.name as country
        FROM lection
             LEFT JOIN country ON country.id = lection.country_id
        WHERE lection.id = :id
    """
)
q = """
SELECT "lection"."id", "lection"."title", "lection"."city", "lection"."country_id", "lection"."content_ru", "lection"."content_en", "lection"."date", "lection"."is_public_program", "lection"."has_video", "lection"."has_audio", "lection"."is_unknown_source", "lection"."note", "lection"."created_at", "lection"."updated_at", "lection"."tsvector_ru", ts_rank(to_tsvector(COALESCE(("lection"."tsvector_ru")::text, )), plainto_tsquery(russian::regconfig, нирвичара)) AS "rank" FROM "lection" WHERE "lection"."tsvector_ru" @@ (plainto_tsquery(russian::regconfig, нирвичара)) ORDER BY "rank" DESC

"""
