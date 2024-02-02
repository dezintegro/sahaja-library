FROM postgres:15

RUN echo "ru_RU.UTF-8 UTF-8" >> /etc/locale.gen && locale-gen
RUN localedef -i ru_RU -c -f UTF-8 -A /usr/share/locale/locale.alias ru_RU.UTF-8
ENV LANG ru_RU.utf8

ENV TZ Europe/Moscow
RUN echo "$TZ" > /etc/timezone && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime

#RUN apt-get update && apt-get install -y --no-install-recommends postgresql-11-rum postgresql-11-postgis-2.5 postgresql-11-postgis-2.5-scripts

RUN set -x \
        && apt-get update \
    	&& apt-get install -y --no-install-recommends ca-certificates wget && rm -rf /var/lib/apt/lists/* \
    	&& wget -O /usr/share/postgresql/15/extension/hunspell_ru_ru--1.0.sql "https://github.com/postgrespro/hunspell_dicts/raw/master/hunspell_ru_ru/hunspell_ru_ru--1.0.sql" \
    	&& wget -O /usr/share/postgresql/15/extension/hunspell_ru_ru.control "https://github.com/postgrespro/hunspell_dicts/raw/master/hunspell_ru_ru/hunspell_ru_ru.control" \
    	&& wget -O /usr/share/postgresql/15/tsearch_data/ru_ru.dict "https://github.com/postgrespro/hunspell_dicts/raw/master/hunspell_ru_ru/ru_ru.dict" \
    	&& wget -O /usr/share/postgresql/15/tsearch_data/ru_ru.affix "https://github.com/postgrespro/hunspell_dicts/raw/master/hunspell_ru_ru/ru_ru.affix" \
        && apt-get purge -y --auto-remove ca-certificates wget


# TODO: What i want to do here?
#VOLUME /var/lib/postgresql/data
#VOLUME /usr/share/postgresql/11/tsearch_data
#COPY ./tsearch_data/* /usr/share/postgresql/11/tsearch_data

# TODO: What about CREATE EXTENSION hunspell_ru_ru;

