# Generated by Django 2.2.24 on 2021-11-14 09:32

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('astrobin', '0124_add_gear_rename_records'),
    ]

    operations = [
        migrations.AddField(
            model_name='imagerevision',
            name='title',
            field=models.CharField(
                blank=True,
                help_text="The revision's title will be shown as an addendum to the original image's title.",
                max_length=128,
                null=True,
                verbose_name='Title'),
        ),
    ]
