(function () {
  var form = document.getElementById('contact-form');
  var note = document.getElementById('form-note');
  var button = form.querySelector('button[type="submit"]');
  var fallback = 'kravi (at) chicagobooth (dot) edu';

  // Until a real Formspree form ID is set in contact.html, fall back to the visitor's email app.
  var configured = form.action.indexOf('YOUR_FORM_ID') === -1;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!configured) {
      var to = ['kravi', 'chicagobooth.edu'].join('@');
      var name = form.elements.name.value.trim();
      var body = form.elements.message.value.trim() + '\n\n— ' + name + ' (' + form.elements.email.value.trim() + ')';
      window.location.href = 'mailto:' + to + '?subject=' +
        encodeURIComponent('Message from ' + name + ' via your website') +
        '&body=' + encodeURIComponent(body);
      return;
    }

    button.disabled = true;
    note.textContent = 'Sending…';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    }).then(function (res) {
      if (!res.ok) throw new Error('Request failed');
      form.reset();
      note.textContent = 'Thanks! Your message was sent.';
    }).catch(function () {
      note.textContent = 'Something went wrong. Please email me at ' + fallback + '.';
    }).then(function () {
      button.disabled = false;
    });
  });
})();
