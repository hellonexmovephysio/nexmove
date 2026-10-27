'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const POLL_INTERVAL_MS = 5000;
  const MAX_AUTOMATIC_CHECKS = 24; // About two minutes of active checks.
  const REQUEST_TIMEOUT_MS = 10000;
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get('ref');
  const access = new URLSearchParams(window.location.hash.slice(1)).get('access');
  const legacyCheckoutSession = urlParams.get('session_id');

  const loading = document.getElementById('loading');
  const details = document.getElementById('confirmationDetails');
  const errorState = document.getElementById('errorState');
  const errorMessage = document.getElementById('errorMessage');
  const title = document.getElementById('mainTitle');
  const description = document.getElementById('mainDesc');
  const tick = document.querySelector('.confirm-tick');
  const note = document.getElementById('smallNote');
  const checkButton = document.getElementById('checkPaymentStatus');

  let activeChecks = 0;
  let timer = null;
  let inFlight = false;
  let finished = false;
  let lastStatus = null;

  const isTerminal = status => (
    status === 'paid' || status === 'failed' ||
    status === 'cancelled' || status === 'refunded'
  );

  const setDescription = (prefix, patientName, suffix) => {
    const strongName = document.createElement('strong');
    strongName.textContent = String(patientName || '');
    description.replaceChildren(
      document.createTextNode(prefix),
      strongName,
      document.createTextNode(suffix)
    );
  };

  const stopPolling = () => {
    finished = true;
    if (timer !== null) window.clearTimeout(timer);
    timer = null;
  };

  const showCheckButton = visible => {
    checkButton.style.display = visible ? 'inline-block' : 'none';
    checkButton.disabled = inFlight;
  };

  const showAccessError = () => {
    stopPolling();
    loading.style.display = 'none';
    details.style.display = 'none';
    errorState.style.display = 'block';
    errorMessage.textContent = 'This private booking link is missing, invalid or expired. '
      + 'Please contact NEXmove with your booking reference. Do not pay again without checking your booking status.';
    showCheckButton(false);
  };

  const showTemporaryError = () => {
    loading.style.display = 'none';
    if (details.style.display !== 'block') {
      errorState.style.display = 'block';
      errorMessage.textContent = 'We cannot check your payment status right now. '
        + 'Your payment may still be processing. Please do not pay again without contacting NEXmove.';
    } else {
      note.textContent = 'We temporarily cannot refresh your payment status. We will try again.';
    }
  };

  const updateStatus = booking => {
    loading.style.display = 'none';
    errorState.style.display = 'none';
    details.style.display = 'block';

    document.getElementById('bookRef').textContent = booking.booking_ref || '';
    document.getElementById('bookService').textContent = booking.service_name || '';
    document.getElementById('bookTime').textContent = booking.preferred_time || '';
    document.getElementById('bookAddress').textContent = [
      booking.address_line1, booking.city, booking.postcode,
    ].filter(Boolean).join(', ');

    // YYYY-MM-DD dates in booking records are calendar dates, not local-midnight timestamps.
    const dateValue = booking.preferred_date;
    const date = typeof dateValue === 'string'
      ? new Date(dateValue.slice(0, 10) + 'T12:00:00Z')
      : new Date(dateValue);
    document.getElementById('bookDate').textContent = Number.isNaN(date.getTime())
      ? 'To be confirmed'
      : date.toLocaleDateString('en-GB', {
          day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
        });

    const status = booking.payment_status;
    lastStatus = status;
    document.getElementById('bookPaymentStatus').textContent = ({
      pending: 'Pending / Processing',
      paid: 'Paid',
      failed: 'Failed',
      cancelled: 'Cancelled',
      refunded: 'Refunded',
    })[status] || 'Status unavailable';

    if (status === 'paid') {
      title.textContent = 'Payment received';
      setDescription('Thank you, ', booking.full_name,
        '. Your payment was successful. We will contact you to arrange your preferred appointment.');
      tick.style.backgroundColor = '#10b981';
      tick.textContent = '✓';
      note.textContent = 'Please keep your booking reference for your records.';
    } else if (status === 'pending') {
      title.textContent = 'Payment processing...';
      setDescription('Thank you, ', booking.full_name,
        '. We are waiting for payment confirmation. Please do not make another payment.');
      tick.style.backgroundColor = '#f59e0b';
      tick.textContent = '⌛';
      note.textContent = 'Checking payment status automatically...';
    } else if (status === 'refunded') {
      title.textContent = 'Payment refunded';
      setDescription('Hello, ', booking.full_name,
        '. This booking payment has been refunded. Please contact NEXmove if you need help.');
      tick.style.backgroundColor = '#64748b';
      tick.textContent = '↩';
      note.textContent = 'Please contact NEXmove before creating a new booking.';
    } else if (status === 'failed' || status === 'cancelled') {
      title.textContent = 'Payment not completed';
      setDescription('Hello, ', booking.full_name,
        '. We could not confirm payment for this booking. Please contact NEXmove before trying again.');
      tick.style.backgroundColor = '#ef4444';
      tick.textContent = '✕';
      note.textContent = 'Check with NEXmove before attempting another payment.';
    } else {
      title.textContent = 'Booking status unavailable';
      setDescription('Hello, ', booking.full_name,
        '. Your booking was received, but the current payment status is unavailable.');
      tick.style.backgroundColor = '#64748b';
      tick.textContent = '?';
      note.textContent = 'Contact NEXmove with your booking reference for an update.';
    }

    if (isTerminal(status) || status !== 'pending') {
      stopPolling();
      showCheckButton(false);
    }
  };

  const scheduleNextCheck = () => {
    if (finished || lastStatus !== 'pending') return;
    if (activeChecks >= MAX_AUTOMATIC_CHECKS) {
      stopPolling();
      const expiryMessage = 'Payment is still unconfirmed. Please keep this reference. '
        + 'We will email you once payment is confirmed, or you can check again below. Do not pay twice.';
      if (details.style.display === 'block') {
        note.textContent = expiryMessage;
      } else {
        errorMessage.textContent = expiryMessage;
      }
      showCheckButton(true);
      return;
    }
    if (timer !== null) window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      timer = null;
      if (document.hidden) {
        scheduleNextCheck(); // Pause network polling while the page is not visible.
        return;
      }
      checkStatus();
    }, POLL_INTERVAL_MS);
  };

  async function checkStatus(manual = false) {
    if (inFlight || (!manual && finished)) return;
    if (!manual && document.hidden) {
      // A background tab still needs to resume its very first check.
      if (!lastStatus) lastStatus = 'pending';
      if (!finished) scheduleNextCheck();
      return;
    }
    if (manual) {
      finished = false;
      activeChecks = 0;
      showCheckButton(false);
    }

    inFlight = true;
    activeChecks++;
    checkButton.disabled = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      // Access credential must remain out of HTTP URLs and logging.
      const response = await fetch('/api/bookings/' + encodeURIComponent(ref), {
        method: 'GET',
        headers: access
          ? { 'X-Booking-Access': access }
          : { 'X-Stripe-Checkout-Session': legacyCheckoutSession },
        cache: 'no-store',
        credentials: 'omit',
        signal: controller.signal,
      });

      if (response.status === 401 || response.status === 403) {
        showAccessError();
        return;
      }

      if (!response.ok) {
        // Legacy Stripe Checkout returns cannot show a record until its payment
        // is paid; do not display an incorrect "payment failed" message on 404.
        if (response.status === 404 && !access && legacyCheckoutSession) {
          lastStatus = 'pending';
          showTemporaryError();
          errorMessage.textContent = 'Stripe is still confirming this payment. '
            + 'We will check again automatically. Do not make another payment.';
        } else if (response.status === 404) {
          showAccessError();
        } else {
          if (!lastStatus) lastStatus = 'pending';
          showTemporaryError();
        }
        return;
      }

      const data = await response.json();
      if (!data.ok || !data.data) {
        if (!lastStatus) lastStatus = 'pending';
        showTemporaryError();
        return;
      }

      updateStatus(data.data);
    } catch (_) {
      if (!lastStatus) lastStatus = 'pending';
      showTemporaryError();
    } finally {
      window.clearTimeout(timeout);
      inFlight = false;
      checkButton.disabled = false;
      if (!finished) {
        if (lastStatus === 'pending') scheduleNextCheck();
      }
    }
  }

  if (!ref || (!access && !legacyCheckoutSession)) {
    showAccessError();
    return;
  }

  checkButton.addEventListener('click', () => checkStatus(true));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden || finished || inFlight || lastStatus !== 'pending') return;
    if (timer !== null) window.clearTimeout(timer);
    timer = null;
    checkStatus();
  });
  window.addEventListener('pagehide', () => {
    if (timer !== null) window.clearTimeout(timer);
    timer = null;
    finished = true;
  });

  checkStatus();
});
