/* Public-site measurement. Google Ads remains scoped to the rental hostname. */
(function () {
  var host = location.hostname;
  if (!['hoflings.com', 'www.hoflings.com', 'mac-studio.hoflings.com'].includes(host) || window.HoflingsAnalyticsLoaded) return;
  window.HoflingsAnalyticsLoaded = true;
  var rental = host === 'mac-studio.hoflings.com';
  var property = 'G-3WWJK4WL51';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', property);
  if (rental) window.gtag('config', 'AW-18587735600');
  var seen = new Set();
  var storageKey = 'hoflings-measured-leads';
  try { JSON.parse(sessionStorage.getItem(storageKey) || '[]').slice(-100).forEach(function (id) { seen.add(id); }); } catch (_) {}
  // Call only after the backend confirms a saved inquiry with its generated ID.
  // Never include names, emails, phone numbers, workload text or other form content.
  window.HoflingsTrackLead = function (id, form) {
    if (typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id) || seen.has(id)) return false;
    if (!['rental_quote', 'contact_inquiry'].includes(form)) return false;
    try {
      window.gtag('event', 'generate_lead', { send_to: property, form_name: form });
      if (rental && form === 'rental_quote') window.gtag('event', 'conversion', {
        send_to: 'AW-18587735600/7l-OCOzBzbwdELCsqZ9F',
        transaction_id: id,
      });
      seen.add(id);
      try { sessionStorage.setItem(storageKey, JSON.stringify(Array.from(seen).slice(-100))); } catch (_) {}
      return true;
    } catch (_) { return false; }
  };
  var tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + property;
  document.head.appendChild(tag);
})();
