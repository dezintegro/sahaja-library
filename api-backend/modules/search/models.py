from django.db import models
from pgvector.django import VectorField

class File(models.Model):
    # ... other fields ...
    embedding_clip_vit_l_14 = VectorField(
        dimensions=768,
        help_text="Vector embeddings (clip-vit-large-patch14) of the file content",
        null=True,
        blank=True,
    )
