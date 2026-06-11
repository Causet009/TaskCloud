from django.urls import path

from . import views


urlpatterns = [
    path("", views.inicio, name="inicio"),
    path("registro/", views.registro, name="registro"),
    path("panel/", views.panel, name="panel"),
    path(
        "cerrar-sesion/",
        views.cerrar_sesion,
        name="cerrar_sesion",
    ),
    path(
        "tarea/<int:tarea_id>/estado/",
        views.cambiar_estado_tarea,
        name="cambiar_estado_tarea",
    ),
    path(
        "tarea/<int:tarea_id>/eliminar/",
        views.eliminar_tarea,
        name="eliminar_tarea",
    ),
]