
from django.contrib.auth import (
    authenticate,
    get_user_model,
    login,
    logout,
)
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render

from .models import Tarea

User = get_user_model()


def inicio(request):
    contexto = {}

    if request.method == "POST":
        correo = request.POST.get("correo", "").strip().lower()
        password = request.POST.get("password", "")

        usuario = authenticate(
            request,
            username=correo,
            password=password,
        )

        if usuario is not None:
            login(request, usuario)
            return redirect("panel")

        contexto["mensaje_login"] = (
            "Correo o contraseña incorrectos."
        )

    return render(
        request,
        "tareas/index.html",
        contexto,
    )


def registro(request):
    contexto = {}

    if request.method == "POST":
        nombre = request.POST.get("nombre", "").strip()
        correo = request.POST.get("correo", "").strip().lower()
        password = request.POST.get("password", "")
        confirmar_password = request.POST.get(
            "confirmar_password",
            "",
        )

        if (
            not nombre
            or not correo
            or not password
            or not confirmar_password
        ):
            contexto["mensaje"] = (
                "Debes completar todos los campos."
            )

        elif len(password) < 8:
            contexto["mensaje"] = (
                "La contraseña debe tener mínimo 8 caracteres."
            )

        elif password != confirmar_password:
            contexto["mensaje"] = (
                "Las contraseñas no coinciden."
            )

        elif User.objects.filter(
            username__iexact=correo
        ).exists():
            contexto["mensaje"] = (
                "Ya existe una cuenta con ese correo."
            )

        else:
            User.objects.create_user(
                username=correo,
                email=correo,
                password=password,
                first_name=nombre,
            )

            contexto["mensaje"] = (
                "Cuenta creada correctamente."
            )

            contexto["registro_exitoso"] = True

    return render(
        request,
        "tareas/registro.html",
        contexto,
    )


@login_required(login_url="inicio")
def panel(request):
    if request.method == "POST":
        titulo = request.POST.get("titulo", "").strip()
        descripcion = request.POST.get(
            "descripcion",
            "",
        ).strip()

        if titulo:
            Tarea.objects.create(
                usuario=request.user,
                titulo=titulo,
                descripcion=descripcion,
            )

        return redirect("panel")

    tareas = Tarea.objects.filter(
        usuario=request.user
    ).order_by("-fecha_creacion")

    total = tareas.count()
    completadas = tareas.filter(completada=True).count()
    pendientes = total - completadas

    contexto = {
        "tareas": tareas,
        "total": total,
        "completadas": completadas,
        "pendientes": pendientes,
    }

    return render(
        request,
        "tareas/panel.html",
        contexto,
    )


def cerrar_sesion(request):
    logout(request)
    return redirect("inicio")
@login_required(login_url="inicio")
def cambiar_estado_tarea(request, tarea_id):
    if request.method == "POST":
        tarea = get_object_or_404(
            Tarea,
            id=tarea_id,
            usuario=request.user,
        )

        tarea.completada = not tarea.completada

        tarea.save(
            update_fields=["completada"]
        )

    return redirect("panel")


@login_required(login_url="inicio")
def eliminar_tarea(request, tarea_id):
    if request.method == "POST":
        tarea = get_object_or_404(
            Tarea,
            id=tarea_id,
            usuario=request.user,
        )

        tarea.delete()

    return redirect("panel")