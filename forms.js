(function () {
  'use strict';

  var form = document.getElementById('devis-form');
  if (!form) return;

  var RULES = {
    nom: function (v) { return v.length >= 2; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); },
    telephone: function (v) { return /^(\+33|0)[1-9](\d{2}){4}$/.test(v.replace(/[\s.\-]/g, '')); }
  };

  function field(name) { return form.querySelector('[name="' + name + '"]'); }

  function mark(name, ok) {
    var el = field(name);
    var hint = document.getElementById(name + '-error');
    if (el) el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (hint) hint.hidden = ok;
    return ok;
  }

  function validate() {
    var ok = true;
    Object.keys(RULES).forEach(function (name) {
      var el = field(name);
      if (!el) return;
      if (!mark(name, RULES[name](el.value.trim()))) ok = false;
    });
    if (!form.checkValidity()) {
      form.reportValidity();
      ok = false;
    }
    return ok;
  }

  Object.keys(RULES).forEach(function (name) {
    var el = field(name);
    if (el) {
      el.addEventListener('blur', function () {
        if (el.value.trim()) mark(name, RULES[name](el.value.trim()));
      });
    }
  });

  function done() {
    var msg = document.createElement('div');
    msg.className = 'callout form-success';
    msg.setAttribute('role', 'status');
    msg.innerHTML = '<h2>Demande envoyée</h2><p>Merci, votre demande est bien enregistrée. ' +
      'Nous revenons vers vous sous 24 h ouvrées avec vos devis comparés.</p>';
    form.parentNode.insertBefore(msg, form);
    form.hidden = true;
    msg.scrollIntoView({ block: 'center' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var honey = field('_honey');
    if (honey && honey.value) return;
    if (!validate()) return;

    var btn = form.querySelector('button[type="submit"]');
    var label = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Envoi en cours…'; }

    var data = new FormData(form);
    data.append('page', location.href);

    fetch(form.action, {
      method: 'POST',
      body: data,
      keepalive: true,
      headers: { Accept: 'application/json' }
    }).catch(function () {}).then(function () {
      if (btn) { btn.disabled = false; btn.textContent = label; }
      done();
    });
  });
})();
