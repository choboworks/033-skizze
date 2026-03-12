/* 033-Skizze: Theme Bootstrap (synchron vor React) */
/* Reihenfolge: ?theme -> localStorage -> data-theme -> 'light' */

(function () {
  var STORAGE_KEY = 'skizze.theme.v1'; // <— neuer, versionierter Key
  var d = document.documentElement;
  var qs = new URLSearchParams(location.search);
  var forced = qs.get('theme');

  var isTheme = function (v) {
    return v === 'dark' || v === 'light';
  };

  var fromStorage = (function () {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  })();

  var initial = isTheme(forced)
    ? forced
    : isTheme(fromStorage)
    ? fromStorage
    : isTheme(d.dataset.theme)
    ? d.dataset.theme
    : 'light';

  d.setAttribute('data-theme', initial);
  try { d.style.colorScheme = initial; } catch (e) { /* noop */ }
})();
