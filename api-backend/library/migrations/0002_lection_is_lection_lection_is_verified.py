# Generated by Django 4.0.2 on 2022-08-02 19:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("library", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="lection",
            name="is_lection",
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name="lection",
            name="is_verified",
            field=models.BooleanField(default=False),
        ),
    ]