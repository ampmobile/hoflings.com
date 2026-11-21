/* The existing Mac Studio page loads this GA4 property separately. */
(function () {
  if (!['hoflings.com', 'www.hoflings.com'].includes(location.hostname)) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', 'G-3WWJK4WL51');
  var tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=G-3WWJK4WL51';
  document.head.appendChild(tag);
})();
