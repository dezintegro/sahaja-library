"""add_stored_proc

Revision ID: e91cf67ca687
Revises: 1e45fde8fa8e
Create Date: 2020-05-18 23:30:47.527365

"""
from alembic import op
from app.db.query.stored_procedures import (
    make_tsvector,
    tsvector_trigger_proc,
    tsvector_trigger,
)

revision = "e91cf67ca687"
down_revision = "15a6ad4fe0a7"
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()
    conn.execute(make_tsvector)
    conn.execute(tsvector_trigger_proc)
    conn.execute(tsvector_trigger)


def downgrade():
    pass
