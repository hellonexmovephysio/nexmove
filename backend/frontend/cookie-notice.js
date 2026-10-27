/* NEXmove public pages: essential-storage information notice.
   No analytics, advertising pixels, or other optional tracking is introduced here. */
(() => {
  "use strict";

  const KEY = "nexmove_cookie_notice_v1";
  const scriptUrl = document.currentScript && document.currentScript.src;
  const cookiePolicyUrl = new URL("cookie-policy.html", scriptUrl || window.location.href).href;
  const VERSION = 1;
  const LIFETIME_MS = 180 * 24 * 60 * 60 * 1000;

  function hasAcknowledged() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(KEY) || "null");
      return !!(saved && saved.version === VERSION &&
        typeof saved.timestamp === "number" &&
        Date.now() >= saved.timestamp &&
        Date.now() - saved.timestamp < LIFETIME_MS);
    } catch (_) {
      return false;
    }
  }

  function recordAcknowledgement() {
    try {
      window.localStorage.setItem(KEY, JSON.stringify({
        version: VERSION, timestamp: Date.now(), acknowledged: true
      }));
    } catch (_) {
      // A blocked storage API must never stop visitors using the site.
    }
  }

  function init() {
    if (!document.body || document.getElementById("nm-cookie-notice")) return;

    const notice = document.createElement("section");
    notice.id = "nm-cookie-notice";
    notice.className = "nm-cookie-notice";
    notice.setAttribute("aria-label", "Information about website storage");
    notice.innerHTML = [
      '<div class="nm-cookie-inner">',
      '  <div class="nm-cookie-copy">',
      '    <p class="nm-cookie-label">YOUR PRIVACY MATTERS</p>',
      '    <h2>Cookies &amp; website storage</h2>',
      '    <p>We use necessary website storage to remember this notice and support services you request. Find out which technologies are used and how to manage them in our ',
      '    <a href="' + cookiePolicyUrl + '">Cookie Policy</a>.</p>',
      '  </div>',
      '  <button class="nm-cookie-button" type="button">Understood</button>',
      '</div>'
    ].join("");

    const acknowledge = notice.querySelector(".nm-cookie-button");
    acknowledge.addEventListener("click", () => {
      recordAcknowledgement();
      notice.hidden = true;
    });

    document.body.appendChild(notice);
    notice.hidden = hasAcknowledged();

    const footer = document.querySelector(".footer-legal") ||
      document.querySelector(".footer-bottom > div") ||
      document.querySelector(".consent-panel .hint a[href*=\"cookie-policy.html\"]")?.parentElement ||
      document.querySelector(".confirmation-card > .small-note a[href*=\"cookie-policy.html\"]")?.parentElement;
    if (footer && !document.getElementById("nm-cookie-open")) {
      const separator = document.createElement("span");
      separator.setAttribute("aria-hidden", "true");
      separator.textContent = "•";

      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.id = "nm-cookie-open";
      trigger.className = "nm-cookie-footer-trigger";
      trigger.textContent = "Cookie settings";
      trigger.setAttribute("aria-controls", "nm-cookie-notice");
      trigger.addEventListener("click", () => {
        notice.hidden = false;
        acknowledge.focus({ preventScroll: true });
      });

      if (footer.classList.contains("footer-legal")) footer.appendChild(separator);
      footer.appendChild(trigger);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
