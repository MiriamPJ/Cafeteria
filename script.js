const launcher = document.querySelector('#chat-launcher');
const panel = document.querySelector('#chat-panel');
const closeButton = document.querySelector('.chat-close');
const form = document.querySelector('#chat-form');
const input = document.querySelector('#chat-input');
const messages = document.querySelector('#chat-messages');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#main-nav');

function setChatOpen(open) {
  launcher.classList.toggle('is-open', open);
  panel.classList.toggle('is-open', open);
  launcher.setAttribute('aria-expanded', String(open));
  panel.setAttribute('aria-hidden', String(!open));
  if (open) window.setTimeout(() => input.focus(), 120);
}

launcher.addEventListener('click', () => setChatOpen(!panel.classList.contains('is-open')));
closeButton.addEventListener('click', () => setChatOpen(false));
document.querySelectorAll('[data-open-chat]').forEach(button => button.addEventListener('click', () => setChatOpen(true)));
document.querySelectorAll('[data-reply]').forEach(button => button.addEventListener('click', () => sendMessage(button.dataset.reply)));

function appendMessage(text, type) {
  const bubble = document.createElement('div');
  bubble.className = `message ${type}-message`;
  bubble.textContent = text;
  messages.append(bubble);
  messages.scrollTop = messages.scrollHeight;
}

function answerFor(text) {
  const query = text.toLocaleLowerCase('es');
  if (query.includes('menú') || query.includes('menu') || query.includes('carta')) {
    return '¡Claro! La carta que ves en esta página es de muestra. Aún falta cargar el menú oficial y sus precios. Si quieres, puedes dejar tu pregunta para el equipo.';
  }
  if (query.includes('ubicación') || query.includes('direccion') || query.includes('dirección') || query.includes('dónde') || query.includes('donde')) {
    return 'La dirección de la cafetería todavía no está configurada. La añadiremos aquí cuando esté confirmada. ☕';
  }
  if (query.includes('horario') || query.includes('abren') || query.includes('cierran')) {
    return 'Todavía no tengo los horarios oficiales, así que prefiero no adivinarlos. En cuanto estén cargados, te los comparto por aquí.';
  }
  if (query.includes('alerg') || query.includes('ingrediente') || query.includes('vegano') || query.includes('gluten')) {
    return 'Aún no tengo la información oficial de ingredientes y alérgenos. Para cuidarte, no voy a suponerla; consulta con el equipo de la cafetería.';
  }
  if (query.includes('pedido') || query.includes('reserv')) {
    return 'La toma de pedidos y reservaciones se activará cuando conectemos el sistema de la cafetería. Por ahora, no puedo registrar ni confirmar una solicitud.';
  }
  return 'Gracias por escribirnos. Soy una versión de demostración y todavía no tengo conectada la información oficial. Cuéntame si tu duda es sobre menú, horarios, ubicación o pedidos y te indicaré qué falta configurar.';
}

function sendMessage(text) {
  const clean = text.trim();
  if (!clean) return;
  document.querySelectorAll('.quick-replies').forEach(row => row.remove());
  appendMessage(clean, 'user');
  input.value = '';
  window.setTimeout(() => appendMessage(answerFor(clean), 'bot'), 350);
}

form.addEventListener('submit', event => {
  event.preventDefault();
  sendMessage(input.value);
});
navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Abrir menú');
}));
document.querySelector('#year').textContent = new Date().getFullYear();

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    setChatOpen(false);
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});
