from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("tareas", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="tarea",
            name="archivo",
            field=models.FileField(
                upload_to="tareas/",
                blank=True,
                null=True,
            ),
        ),
    ]