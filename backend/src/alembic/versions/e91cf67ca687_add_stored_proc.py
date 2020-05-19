"""add_stored_proc

Revision ID: e91cf67ca687
Revises: 1e45fde8fa8e
Create Date: 2020-05-18 23:30:47.527365

"""
from alembic import op
from db.query import make_ts_vector_ru

revision = "e91cf67ca687"
down_revision = "1e45fde8fa8e"
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()
    conn.execute(
        make_ts_vector_ru
    )


def downgrade():
    pass
