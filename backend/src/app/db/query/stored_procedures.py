from sqlalchemy import text


make_tsvector = text(
    """
        CREATE OR REPLACE FUNCTION make_tsvector_ru(title TEXT, content TEXT)
          RETURNS tsvector AS $$
        BEGIN
          RETURN (setweight(to_tsvector(title),'A') ||
            setweight(to_tsvector(content), 'B'));
        END
        $$ LANGUAGE 'plpgsql' IMMUTABLE;
    """
)

tsvector_trigger_proc = text(
    """
        CREATE OR REPLACE FUNCTION tsvector_ru_trigger() 
          RETURNS trigger AS $$
        BEGIN
          NEW.tsvector_ru := make_tsvector_ru(NEW.title::text, NEW.content_ru::text);
          RETURN NEW;
        END
        $$ LANGUAGE 'plpgsql';
    """
)


tsvector_trigger = text(
    """
        CREATE TRIGGER update_tsvector_ru BEFORE INSERT OR UPDATE
        ON lection
        FOR EACH ROW EXECUTE PROCEDURE
        tsvector_ru_trigger()
    """
)
