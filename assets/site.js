var PORTAL_URL = 'https://portalclientes.medinacargoxpress.com/';
// If the portal has a public tracking route, set it here and put {code} where the tracking number goes.
var TRACKING_URL = PORTAL_URL;

(function () {
  // Mobile menu
  var menuBtn = document.getElementById('menu-btn');
  var nav = document.getElementById('nav');
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Tracking: opens the customer portal in a new tab
  var trackForm = document.getElementById('track-form');
  var trackInput = document.getElementById('track-input');
  var trackMsg = document.getElementById('track-msg');
  trackForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var code = trackInput.value.trim();
    trackMsg.hidden = false;
    if (!code) {
      trackMsg.textContent = 'Escribe tu número de rastreo para buscarlo.';
      trackInput.focus();
      return;
    }
    window.open(TRACKING_URL.replace('{code}', encodeURIComponent(code)), '_blank', 'noopener');
    trackMsg.textContent = 'Abrimos el portal de clientes en otra pestaña. Entra a tu cuenta para ver tu paquete.';
  });

  // Quote: keep the WhatsApp link in sync with the form
  var quoteForm = document.getElementById('quote-form');
  var quoteSend = document.getElementById('quote-send');
  function buildQuoteLink() {
    var data = new FormData(quoteForm);
    var lines = [
      'Hola China Box, quiero cotizar un envío.',
      'Origen: ' + data.get('origen'),
      'Vía: ' + data.get('via')
    ];
    var contenido = (data.get('contenido') || '').trim();
    var peso = (data.get('peso') || '').trim();
    if (contenido) lines.push('Contenido: ' + contenido);
    if (peso) lines.push('Peso aproximado: ' + peso + ' lb');
    quoteSend.href = 'https://wa.me/18095498800?text=' + encodeURIComponent(lines.join('\n'));
  }
  quoteForm.addEventListener('input', buildQuoteLink);
  quoteForm.addEventListener('submit', function (e) { e.preventDefault(); });
  document.querySelectorAll('[data-via]').forEach(function (link) {
    link.addEventListener('click', function () {
      var radio = quoteForm.querySelector('input[name="via"][value="' + link.dataset.via + '"]');
      if (radio) { radio.checked = true; buildQuoteLink(); }
    });
  });
  buildQuoteLink();
})();
