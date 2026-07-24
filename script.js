"use strict";

console.log("Invitación XV Pilar cargada correctamente");


// ================================
// CONFIGURACIÓN
// ================================

const CONFIG = {
  fechaEvento: "2026-10-31T21:00:00-03:00",

  formularioUrl:
    "https://script.google.com/macros/s/AKfycbwubbmR9ppHHEkaaJMjwCNo4gx56fM-GsIkgDx3o-hrhREAtpJXcssFlFVVigg7H_eF/exec"
};


// ================================
// CUENTA REGRESIVA
// ================================

const countdownElements = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
  message: document.getElementById("countdown-message")
};

const fechaEvento = new Date(CONFIG.fechaEvento).getTime();

function agregarCero(numero) {
  return String(numero).padStart(2, "0");
}

function actualizarCuentaRegresiva() {
  const ahora = Date.now();
  const distancia = fechaEvento - ahora;

  if (distancia <= 0) {
    countdownElements.days.textContent = "00";
    countdownElements.hours.textContent = "00";
    countdownElements.minutes.textContent = "00";
    countdownElements.seconds.textContent = "00";

    countdownElements.message.textContent =
      "¡Llegó el gran día! ✨";

    return false;
  }

  const segundo = 1000;
  const minuto = segundo * 60;
  const hora = minuto * 60;
  const dia = hora * 24;

  const diasRestantes = Math.floor(distancia / dia);
  const horasRestantes = Math.floor((distancia % dia) / hora);
  const minutosRestantes = Math.floor((distancia % hora) / minuto);
  const segundosRestantes = Math.floor(
    (distancia % minuto) / segundo
  );

  countdownElements.days.textContent =
    agregarCero(diasRestantes);

  countdownElements.hours.textContent =
    agregarCero(horasRestantes);

  countdownElements.minutes.textContent =
    agregarCero(minutosRestantes);

  countdownElements.seconds.textContent =
    agregarCero(segundosRestantes);

  return true;
}

actualizarCuentaRegresiva();

const intervaloCountdown = setInterval(() => {
  const continuar = actualizarCuentaRegresiva();

  if (!continuar) {
    clearInterval(intervaloCountdown);
  }
}, 1000);


// ================================
// FORMULARIO
// ================================

const form = document.getElementById("xvForm");
const respuesta = document.getElementById("respuesta");
const submitButton = document.getElementById("submitButton");

function mostrarRespuesta(mensaje, tipo) {
  respuesta.textContent = mensaje;
  respuesta.classList.remove("success", "error");

  if (tipo) {
    respuesta.classList.add(tipo);
  }
}

function cambiarEstadoBoton(enviando) {
  submitButton.disabled = enviando;
  submitButton.classList.toggle("loading", enviando);
}

async function enviarFormulario(event) {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  cambiarEstadoBoton(true);
  mostrarRespuesta("Enviando confirmación...");

  const datosFormulario = new FormData(form);

  datosFormulario.append(
    "fechaEnvio",
    new Date().toLocaleString("es-UY")
  );

  try {
    const response = await fetch(CONFIG.formularioUrl, {
      method: "POST",
      body: datosFormulario
    });

    if (!response.ok) {
      throw new Error(
        `Error HTTP: ${response.status}`
      );
    }

    mostrarRespuesta(
      "¡Gracias! Tu confirmación fue enviada correctamente 🤍",
      "success"
    );

    form.reset();

  } catch (error) {
    console.error("Error al enviar el formulario:", error);

    mostrarRespuesta(
      "No pudimos enviar la confirmación. Intentá nuevamente.",
      "error"
    );

  } finally {
    cambiarEstadoBoton(false);
  }
}

if (form && respuesta && submitButton) {
  form.addEventListener("submit", enviarFormulario);
} else {
  console.error(
    "No se encontraron todos los elementos del formulario."
  );
}