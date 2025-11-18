"""
Management command to generate embeddings for existing lections.
Usage: python manage.py generate_embeddings [--batch-size BATCH_SIZE] [--force]
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from modules.core.models import Lection
from modules.search.services.embeddings import embedding_service


class Command(BaseCommand):
    help = "Generate embeddings for lections that don't have them yet"

    def add_arguments(self, parser):
        parser.add_argument(
            "--batch-size",
            type=int,
            default=100,
            help="Number of lections to process in one batch (default: 100)",
        )
        parser.add_argument(
            "--force",
            action="store_true",
            help="Regenerate embeddings even for lections that already have them",
        )
        parser.add_argument(
            "--limit",
            type=int,
            default=None,
            help="Limit the number of lections to process",
        )

    def handle(self, *args, **options):
        batch_size = options["batch_size"]
        force = options["force"]
        limit = options["limit"]

        # Get lections that need embeddings
        if force:
            queryset = Lection.objects.filter(content_ru__isnull=False)
            self.stdout.write(
                self.style.WARNING(
                    "Regenerating embeddings for all lections with content..."
                )
            )
        else:
            queryset = Lection.objects.filter(
                content_ru__isnull=False, embedding__isnull=True
            )
            self.stdout.write(
                self.style.SUCCESS(
                    "Generating embeddings for lections without them..."
                )
            )

        if limit:
            queryset = queryset[:limit]

        total_count = queryset.count()

        if total_count == 0:
            self.stdout.write(
                self.style.SUCCESS("No lections to process. All done!")
            )
            return

        self.stdout.write(f"Found {total_count} lections to process")

        # Process in batches
        processed = 0
        for i in range(0, total_count, batch_size):
            batch = list(queryset[i : i + batch_size])

            # Extract texts
            texts = [lection.content_ru for lection in batch]

            # Generate embeddings
            self.stdout.write(f"Processing batch {i // batch_size + 1}...")
            embeddings = embedding_service.generate_embeddings(
                texts, batch_size=32
            )

            # Update lections with embeddings
            with transaction.atomic():
                for lection, embedding in zip(batch, embeddings):
                    lection.embedding = embedding.tolist()
                    lection.save(update_fields=["embedding"])

            processed += len(batch)
            self.stdout.write(
                self.style.SUCCESS(
                    f"Processed {processed}/{total_count} lections"
                )
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully generated embeddings for {processed} lections!"
            )
        )
