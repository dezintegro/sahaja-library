from sqlalchemy import text

search_query = text(
    """
        SELECT id, title, ts_headline(content_ru, q, 'StartSel = <span>, StopSel = </span>'), rank
        FROM lection, plainto_tsquery(:query) AS q, ts_rank(tsvector_ru, q) as rank
        WHERE tsvector_ru @@ q and rank > 0.1
        ORDER BY rank DESC OFFSET :offset LIMIT :limit;
    """
)

make_ts_vector = text(
    """
        CREATE OR REPLACE FUNCTION make_tsvector(title TEXT, content TEXT)
          RETURNS tsvector AS $$
        BEGIN
          RETURN (setweight(to_tsvector(title),'A') ||
            setweight(to_tsvector(content), 'B'));
        END
        $$ LANGUAGE 'plpgsql' IMMUTABLE;
    """
)

tsvector_ru_trigger = text(
    """
        CREATE OR REPLACE FUNCTION tsvector_ru_trigger() 
          RETURNS trigger AS $$
        BEGIN
          NEW.tsvector_ru := make_tsvector(NEW.title, NEW.content_ru);
          RETURN NEW;
        END
        $$ LANGUAGE 'plpgsql';
    """
)


upadte_ts_vector_trigger = text(
    """
        CREATE TRIGGER update_tsvector_ru BEFORE INSERT OR UPDATE
        ON lection
        FOR EACH ROW EXECUTE PROCEDURE
        update_row_ts_vector_ru()
    """
)
