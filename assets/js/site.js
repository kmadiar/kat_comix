// Strips&Meer — kleine interacties (werkt ook zonder JavaScript)
(function () {
  // Genrefilter op de stripspagina
  var filter = document.querySelector('[data-filter]');
  var items = document.querySelector('[data-filter-items]');
  if (filter && items) {
    filter.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-genre]');
      if (!btn) return;
      var genre = btn.getAttribute('data-genre');
      filter.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      items.querySelectorAll('[data-genre]').forEach(function (card) {
        card.hidden = genre !== '' && card.getAttribute('data-genre') !== genre;
      });
    });
  }

  // Leesmodus in de striplezer: pagina of plaatje voor plaatje
  var comic = document.querySelector('[data-comic]');
  var seg = document.querySelector('.seg');
  if (comic && seg) {
    var KEY = 'paarse-post-leesmodus';
    var setMode = function (mode) {
      comic.classList.toggle('comic--page', mode === 'page');
      comic.classList.toggle('comic--strip', mode === 'strip');
      seg.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-mode') === mode ? 'true' : 'false');
      });
      try { localStorage.setItem(KEY, mode); } catch (err) {}
    };
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (err) {}
    if (!saved && window.matchMedia('(max-width: 560px)').matches) saved = 'strip';
    if (saved) setMode(saved);
    seg.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-mode]');
      if (b) setMode(b.getAttribute('data-mode'));
    });
  }
})();
