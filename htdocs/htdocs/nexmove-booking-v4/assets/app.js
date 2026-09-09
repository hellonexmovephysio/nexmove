(() => {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const message = document.getElementById('formMessage');
  const pain = document.getElementById('painRange');
  const painValue = document.getElementById('painValue');
  const preferredDate = document.getElementById('preferredDate');

  const now = new Date();
  const localISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  preferredDate.min = localISO;
  if (!preferredDate.value) preferredDate.value = localISO;

  pain.addEventListener('input', () => { painValue.value = pain.value; });

  document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const input = card.querySelector('input');
      input.checked = true;
      document.getElementById('sumService').textContent = input.dataset.name;
      document.getElementById('sumDuration').textContent = input.dataset.duration;
      document.getElementById('sumType').textContent = input.dataset.type;
      document.getElementById('sumPrice').textContent = Math.round(Number(input.dataset.price)).toLocaleString('en-GB');
    });
  });

  document.querySelectorAll('.time-card').forEach((card) => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.time-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      card.querySelector('input').checked = true;
    });
  });

  document.querySelectorAll('.condition-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.condition-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
    });
  });

  document.getElementById('findAddress').addEventListener('click', async () => {
    const postcode = form.elements.postcode.value.trim();
    const hint = document.getElementById('addressHint');
    if (!postcode) {
      hint.textContent = 'Please enter a postcode first.';
      form.elements.postcode.focus();
      return;
    }

    hint.textContent = 'Checking postcode…';
    try {
      const res = await fetch('https://api.postcodes.io/postcodes/' + encodeURIComponent(postcode));
      const data = await res.json();
      if (res.ok && data.status === 200 && data.result) {
        const place = data.result.admin_district || data.result.parish || data.result.region || '';
        if (place && !form.elements.city.value) form.elements.city.value = place;
        hint.textContent = 'Postcode recognised. Please enter your house number/street in Address.';
        form.elements.address_line1.focus();
      } else {
        hint.textContent = 'Postcode not found. You can still enter the address manually.';
      }
    } catch (_) {
      hint.textContent = 'Address lookup is unavailable right now. Please enter the address manually.';
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.className = 'form-message';
    message.textContent = '';

    if (!form.reportValidity()) return;

    const button = document.querySelector('.continue-btn');
    const original = button.innerHTML;
    button.disabled = true;
    button.textContent = 'Saving booking…';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });

      const text = await response.text();
      let data;
      try { data = JSON.parse(text); }
      catch (_) { throw new Error(text || 'Invalid server response'); }

      if (!response.ok || !data.ok) {
        const errors = Array.isArray(data.errors) ? '\n• ' + data.errors.join('\n• ') : '';
        message.className = 'form-message error';
        message.textContent = (data.message || 'Please check the form.') + errors;
        message.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      window.location.href = data.redirect;
    } catch (error) {
      console.error(error);
      message.className = 'form-message error';
      message.textContent = 'The booking could not be submitted. If you opened index.php by double-clicking it, use XAMPP/Apache and open http://localhost/nexmove-booking-v2/ instead.';
      message.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } finally {
      button.disabled = false;
      button.innerHTML = original;
    }
  });
})();
