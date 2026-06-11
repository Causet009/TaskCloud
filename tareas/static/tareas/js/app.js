
document.addEventListener("DOMContentLoaded", () => {
  // =====================================
  // INICIO DE SESIÓN
  // =====================================

  const formularioLogin =
    document.getElementById("formulario-login");

  if (formularioLogin) {
    const mensajeLogin =
      document.getElementById("mensaje");

    formularioLogin.addEventListener("submit", (evento) => {
      const correo =
        document.getElementById("correo").value.trim();

      const password =
        document.getElementById("password").value;

      if (correo === "" || password === "") {
        evento.preventDefault();

        mensajeLogin.textContent =
          "Debes completar todos los campos.";

        mensajeLogin.style.color = "#dc2626";
        return;
      }

      mensajeLogin.textContent =
        "Verificando datos...";

      mensajeLogin.style.color = "#2563eb";

      // Si los datos están completos,
      // el formulario se envía a Django.
    });
  }

  // =====================================
  // REGISTRO DE USUARIO
  // =====================================

  const formularioRegistro =
    document.getElementById("formulario-registro");

  if (formularioRegistro) {
    const mensajeRegistro =
      document.getElementById("mensaje-registro");

    formularioRegistro.addEventListener("submit", (evento) => {
      const nombre =
        document.getElementById("nombre").value.trim();

      const correo =
        document
          .getElementById("correo-registro")
          .value.trim();

      const password =
        document.getElementById("password-registro").value;

      const confirmarPassword =
        document.getElementById("confirmar-password").value;

      if (
        nombre === "" ||
        correo === "" ||
        password === "" ||
        confirmarPassword === ""
      ) {
        evento.preventDefault();

        mensajeRegistro.textContent =
          "Debes completar todos los campos.";

        mensajeRegistro.style.color = "#dc2626";
        return;
      }

      if (password.length < 8) {
        evento.preventDefault();

        mensajeRegistro.textContent =
          "La contraseña debe tener mínimo 8 caracteres.";

        mensajeRegistro.style.color = "#dc2626";
        return;
      }

      if (password !== confirmarPassword) {
        evento.preventDefault();

        mensajeRegistro.textContent =
          "Las contraseñas no coinciden.";

        mensajeRegistro.style.color = "#dc2626";
        return;
      }

      mensajeRegistro.textContent =
        "Creando cuenta...";

      mensajeRegistro.style.color = "#2563eb";

      // Si los datos están correctos,
      // el formulario se envía a Django.
    });
  }

  // =====================================
  // PANEL DE TAREAS
  // =====================================

  const formularioTarea =
    document.getElementById("formulario-tarea");

  const contenedorTareas =
    document.getElementById("contenedor-tareas");

  const filtroTareas =
    document.getElementById("filtro-tareas");

  const mensajeTarea =
    document.getElementById("mensaje-tarea");

  function actualizarResumen() {
    if (!contenedorTareas) {
      return;
    }

    const tareas =
      contenedorTareas.querySelectorAll(".item-tarea");

    const tareasCompletadas =
      contenedorTareas.querySelectorAll(
        ".item-tarea.completada"
      );

    const total = tareas.length;
    const completadas = tareasCompletadas.length;
    const pendientes = total - completadas;

    const totalElemento =
      document.getElementById("total-tareas");

    const pendientesElemento =
      document.getElementById("tareas-pendientes");

    const completadasElemento =
      document.getElementById("tareas-completadas");

    if (totalElemento) {
      totalElemento.textContent = total;
    }

    if (pendientesElemento) {
      pendientesElemento.textContent = pendientes;
    }

    if (completadasElemento) {
      completadasElemento.textContent = completadas;
    }
  }

  function aplicarFiltro() {
    if (!contenedorTareas || !filtroTareas) {
      return;
    }

    const filtroSeleccionado =
      filtroTareas.value;

    const tareas =
      contenedorTareas.querySelectorAll(".item-tarea");

    tareas.forEach((tarea) => {
      const estaCompletada =
        tarea.classList.contains("completada");

      if (filtroSeleccionado === "todas") {
        tarea.style.display = "flex";
      } else if (filtroSeleccionado === "pendientes") {
        tarea.style.display =
          estaCompletada ? "none" : "flex";
      } else if (filtroSeleccionado === "completadas") {
        tarea.style.display =
          estaCompletada ? "flex" : "none";
      }
    });
  }

  function crearElementoTarea(titulo, descripcion) {
    const tarea = document.createElement("article");

    tarea.className = "item-tarea";

    tarea.innerHTML = `
      <div class="informacion-tarea">
        <input type="checkbox">

        <div>
          <h4></h4>
          <p></p>
        </div>
      </div>

      <div class="acciones-tarea">
        <button type="button" class="boton-editar">
          Editar
        </button>

        <button type="button" class="boton-eliminar">
          Eliminar
        </button>
      </div>
    `;

    tarea.querySelector("h4").textContent = titulo;

    tarea.querySelector("p").textContent =
      descripcion || "Sin descripción.";

    return tarea;
  }

  if (formularioTarea && contenedorTareas) {
    formularioTarea.addEventListener(
      "submit",
      (evento) => {
        evento.preventDefault();

        const tituloInput =
          document.getElementById("titulo-tarea");

        const descripcionInput =
          document.getElementById("descripcion-tarea");

        const titulo = tituloInput.value.trim();
        const descripcion = descripcionInput.value.trim();

        if (titulo === "") {
          mensajeTarea.textContent =
            "Debes escribir el título de la tarea.";

          mensajeTarea.style.color = "#dc2626";
          return;
        }

        const nuevaTarea =
          crearElementoTarea(titulo, descripcion);

        contenedorTareas.appendChild(nuevaTarea);

        formularioTarea.reset();

        mensajeTarea.textContent =
          "Tarea agregada correctamente.";

        mensajeTarea.style.color = "#16a34a";

        actualizarResumen();
        aplicarFiltro();
      }
    );

    contenedorTareas.addEventListener(
      "click",
      (evento) => {
        const tarea =
          evento.target.closest(".item-tarea");

        if (!tarea) {
          return;
        }

        // ELIMINAR TAREA
        if (
          evento.target.classList.contains(
            "boton-eliminar"
          )
        ) {
          const confirmarEliminacion = confirm(
            "¿Seguro que deseas eliminar esta tarea?"
          );

          if (confirmarEliminacion) {
            tarea.remove();

            actualizarResumen();
            aplicarFiltro();
          }
        }

        // EDITAR TAREA
        if (
          evento.target.classList.contains(
            "boton-editar"
          )
        ) {
          const tituloElemento =
            tarea.querySelector("h4");

          const descripcionElemento =
            tarea.querySelector("p");

          const nuevoTitulo = prompt(
            "Escribe el nuevo título:",
            tituloElemento.textContent
          );

          if (nuevoTitulo === null) {
            return;
          }

          if (nuevoTitulo.trim() === "") {
            alert("El título no puede estar vacío.");
            return;
          }

          const nuevaDescripcion = prompt(
            "Escribe la nueva descripción:",
            descripcionElemento.textContent
          );

          tituloElemento.textContent =
            nuevoTitulo.trim();

          if (nuevaDescripcion !== null) {
            descripcionElemento.textContent =
              nuevaDescripcion.trim() ||
              "Sin descripción.";
          }
        }
      }
    );

    contenedorTareas.addEventListener(
      "change",
      (evento) => {
        if (evento.target.type !== "checkbox") {
          return;
        }

        const tarea =
          evento.target.closest(".item-tarea");

        tarea.classList.toggle(
          "completada",
          evento.target.checked
        );

        actualizarResumen();
        aplicarFiltro();
      }
    );

    if (filtroTareas) {
      filtroTareas.addEventListener(
        "change",
        aplicarFiltro
      );
    }

    actualizarResumen();
  }
});

