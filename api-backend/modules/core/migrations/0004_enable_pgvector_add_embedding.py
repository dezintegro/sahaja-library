# Generated manually for pgvector support

from django.contrib.postgres.operations import CreateExtension
from django.db import migrations
import pgvector.django


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0003_lection_is_meta"),
    ]

    operations = [
        # Enable pgvector extension
        CreateExtension("vector"),
        # Add embedding field to Lection model
        migrations.AddField(
            model_name="lection",
            name="embedding",
            field=pgvector.django.VectorField(
                dimensions=384, blank=True, null=True
            ),
        ),
        # Add index for vector similarity search using cosine distance
        migrations.RunSQL(
            sql="CREATE INDEX IF NOT EXISTS lection_embedding_idx ON lection USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);",
            reverse_sql="DROP INDEX IF EXISTS lection_embedding_idx;",
        ),
    ]
