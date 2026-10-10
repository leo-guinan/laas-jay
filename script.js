(() => {
  const cfg = window.LAAS_CONFIG || {};
  const params = new URLSearchParams(window.location.search);
  const experiment = "laas_three_way_v1";
  const variant = "jay";

  const appendParams = (url) => {
    if (!url) return url;
    try {
      const u = new URL(url, window.location.href);
      params.forEach((v, k) => {
        if (!u.searchParams.has(k)) u.searchParams.set(k, v);
      });
      u.searchParams.set("experiment", experiment);
      u.searchParams.set("landing_variant", variant);
      return u.toString();
    } catch {
      return url;
    }
  };

  const sendEvent = (type, metadata = {}) => {
    const event = {
      type,
      ts: new Date().toISOString(),
      path: window.location.pathname,
      query: Object.fromEntries(params.entries()),
      ...metadata
    };

    try {
      const existing = JSON.parse(localStorage.getItem("laas_events") || "[]");
      existing.push(event);
      localStorage.setItem("laas_events", JSON.stringify(existing.slice(-100)));
    } catch {}

    if (cfg.eventEndpoint) {
      const payload = JSON.stringify(event);
      if (navigator.sendBeacon) {
        navigator.sendBeacon(cfg.eventEndpoint, new Blob([payload], { type: "application/json" }));
      } else {
        fetch(cfg.eventEndpoint, { method: "POST", headers: { "content-type": "application/json" }, body: payload, keepalive: true }).catch(() => {});
      }
    }
  };

  sendEvent("landing_page_view", { referrer: document.referrer || null });

  document.querySelectorAll("[data-cta]").forEach((el) => {
    el.addEventListener("click", () => {
      sendEvent("cta_click", { cta: el.dataset.cta });
      window.fathom?.trackEvent("Calibration CTA Clicked");
    });
  });

  const checkout = document.getElementById("checkout-button");
  const checkoutNote = document.getElementById("checkout-note");
  if (checkout && cfg.checkoutUrl) {
    checkout.href = appendParams(cfg.checkoutUrl);
    checkoutNote.hidden = true;
  } else if (checkout) {
    checkout.addEventListener("click", (e) => {
      if (!cfg.checkoutUrl) e.preventDefault();
    });
  }

  const bipu = document.getElementById("bipu-link");
  if (bipu && cfg.bipuUrl) bipu.href = appendParams(cfg.bipuUrl);

  const trailer = document.getElementById("trailer");
  if (trailer && cfg.trailerYoutubeId) {
    trailer.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(cfg.trailerYoutubeId)}" title="The Homework trailer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    trailer.dataset.empty = "false";
  }
})();
