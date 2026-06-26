from django.conf import settings
from django.db import models


class Tarea(models.Model):
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tareas",
    )

    titulo = models.CharField(
        max_length=200,
    )

    descripcion = models.TextField(
        blank=True,
    )

    archivo = models.FileField(
        upload_to="tareas/",
        blank=True,
        null=True,
    )

    completada = models.BooleanField(
        default=False,
    )

    fecha_creacion = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return self.titulo