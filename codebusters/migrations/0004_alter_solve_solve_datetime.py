# Generated by Django 4.2.2 on 2023-06-25 20:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('codebusters', '0003_alter_solve_puzzle_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='solve',
            name='solve_datetime',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
