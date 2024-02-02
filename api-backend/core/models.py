# Create your models here.
import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models
from model_utils.models import TimeStampedModel


class UUIDModel(models.Model):
    """
    This abstract base class provides id field on any model that inherits from it
    which will be the primary key.
    """

    uuid = models.UUIDField(
        unique=True, default=uuid.uuid4, editable=False, db_index=True
    )

    class Meta:
        abstract = True


class TimestampedUUIDModel(UUIDModel, TimeStampedModel):
    class Meta:
        abstract = True


# class User(UUIDModel, AbstractUser):
#     pass
