# Taken from https://github.com/python-poetry/poetry/discussions/1879#discussioncomment-216865
FROM python:3.9.5-alpine3.13

ENV PYTHONUNBUFFERED=1 \
    # prevents python creating .pyc files
    PYTHONDONTWRITEBYTECODE=1 \
    \
    # pip
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    PIPENV_VENV_IN_PROJECT=1 \
    \
    # poetry
    # https://python-poetry.org/docs/configuration/#using-environment-variables
    # make poetry install to this location
    POETRY_HOME="/opt/poetry" \
    # make poetry create the virtual environment in the project's root
    # it gets named `.venv`
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    # do not ask any interactive question
    POETRY_NO_INTERACTION=1


# prepend poetry and venv to path
ENV PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$PATH"

# Install system deps
RUN apk upgrade && \
    apk add --no-cache curl zlib-dev jpeg-dev gcc python3-dev postgresql-dev build-base linux-headers musl-dev bash bash-completion openssl-dev wget gettext git libxslt-dev libffi-dev cargo && \
    rm -rf /var/cache/apk/*

# Install poetry
RUN curl -sSL https://install.python-poetry.org | python3 -

WORKDIR /usr/src/app

# Copy and install python deps
COPY pyproject.toml poetry.lock ./
RUN poetry config virtualenvs.create false && poetry install

ENV PYTHONPATH="${PYTHONPATH}:/usr/src/app"

# Copy sources
COPY . .
#COPY ../.env.docker .env
#ENTRYPOINT ["/entrypoint.sh" ]
