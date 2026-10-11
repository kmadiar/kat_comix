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

// Zoeken (pagina /zoeken/): doorzoekt een index die Jekyll in de pagina zet
(function () {
  var veld = document.getElementById('zoekveld');
  var lijst = document.getElementById('zoekresultaten');
  var bron = document.getElementById('zoekindex');
  if (!veld || !lijst || !bron) return;
  var aantal = document.getElementById('zoekaantal');
  var leeg = document.getElementById('zoekleeg');
  var items = [];
  try { items = JSON.parse(bron.textContent); } catch (e) { items = []; }

  var norm = function (s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  };
  items.forEach(function (it) { it._zoek = norm([it.type, it.title, it.meta, it.text].join(' ')); });

  var maak = function (tag, cls, tekst) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (tekst != null) el.textContent = tekst;
    return el;
  };

  var toon = function (q) {
    var woorden = norm(q).split(/\s+/).filter(Boolean);
    lijst.textContent = '';
    if (!woorden.length) { aantal.textContent = 'Typ om te zoeken'; leeg.hidden = true; return; }
    var hits = items.filter(function (it) {
      return woorden.every(function (w) { return it._zoek.indexOf(w) !== -1; });
    });
    aantal.textContent = hits.length === 1 ? '1 resultaat' : hits.length + ' resultaten';
    leeg.hidden = hits.length > 0;
    hits.forEach(function (it) {
      var li = maak('li');
      var a = maak('a', 'card result');
      a.href = it.url;
      var img = maak('div', 'result__img ht');
      if (it.img) { var im = maak('img'); im.src = it.img; im.alt = ''; im.loading = 'lazy'; img.appendChild(im); }
      var txt = maak('div', 'result__text');
      txt.appendChild(maak('span', 'tag tag--sm' + (it.type === 'Strip' ? ' tag--sun' : ''), it.type));
      txt.appendChild(maak('strong', null, it.title));
      txt.appendChild(maak('span', 'meta', it.meta));
      a.appendChild(img); a.appendChild(txt); li.appendChild(a); lijst.appendChild(li);
    });
  };

  var start = new URLSearchParams(location.search).get('q') || '';
  veld.value = start;
  toon(start);
  veld.addEventListener('input', function () {
    toon(veld.value);
    try {
      var url = new URL(location.href);
      if (veld.value) url.searchParams.set('q', veld.value); else url.searchParams.delete('q');
      history.replaceState(null, '', url);
    } catch (e) {}
  });
  veld.focus();
})();

// Liken en favorieten: bewaard in localStorage (per browser)
(function () {
  var KEY = 'strips-meer-favorieten';
  var lees = function () {
    try { var v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return []; }
  };
  var bewaar = function (lijst) {
    try { localStorage.setItem(KEY, JSON.stringify(lijst)); } catch (e) {}
  };
  var heeft = function (lijst, id) { return lijst.some(function (f) { return f.id === id; }); };

  var teller = function () {
    var n = lees().length;
    document.querySelectorAll('[data-fav-count]').forEach(function (el) {
      el.textContent = n; el.hidden = n === 0;
    });
  };

  var zetKnop = function (btn, aan) {
    btn.setAttribute('aria-pressed', aan ? 'true' : 'false');
    var label = btn.querySelector('.like-btn__label');
    if (label) label.textContent = aan ? 'Geliket' : 'Liken';
  };

  document.querySelectorAll('[data-like]').forEach(function (btn) {
    var id = btn.getAttribute('data-like');
    zetKnop(btn, heeft(lees(), id));
    btn.addEventListener('click', function () {
      var lijst = lees();
      if (heeft(lijst, id)) {
        lijst = lijst.filter(function (f) { return f.id !== id; });
      } else {
        lijst.unshift({
          id: id, url: id,
          title: btn.getAttribute('data-title') || '',
          meta: btn.getAttribute('data-meta') || '',
          img: btn.getAttribute('data-img') || ''
        });
      }
      bewaar(lijst);
      zetKnop(btn, heeft(lijst, id));
      teller();
    });
  });

  var bak = document.querySelector('[data-fav-list]');
  var leeg = document.getElementById('favleeg');
  var maak = function (tag, cls, tekst) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (tekst != null) el.textContent = tekst;
    return el;
  };
  var hart = '<svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.6-9.2A5.3 5.3 0 0 1 12 6.1a5.3 5.3 0 0 1 9.6 5.2c-2.1 4.6-9.6 9.2-9.6 9.2z"/></svg>';
  var toon = function () {
    if (!bak) return;
    var lijst = lees();
    bak.textContent = '';
    if (leeg) leeg.hidden = lijst.length > 0;
    lijst.forEach(function (f) {
      var kaart = maak('article', 'card fav-card');
      var plaat = maak('a', 'fav-card__img ht');
      plaat.href = f.url;
      plaat.setAttribute('aria-label', 'Lees ' + f.title);
      if (f.img) { var im = maak('img'); im.src = f.img; im.alt = ''; im.loading = 'lazy'; plaat.appendChild(im); }
      var body = maak('div', 'fav-card__body');
      var titel = maak('a', 'fav-card__title', f.title); titel.href = f.url;
      var weg = maak('button', 'fav-card__remove');
      weg.type = 'button';
      weg.setAttribute('aria-label', 'Verwijder ' + f.title + ' uit favorieten');
      weg.innerHTML = hart;
      weg.appendChild(document.createTextNode('Niet meer liken'));
      weg.addEventListener('click', function () {
        bewaar(lees().filter(function (x) { return x.id !== f.id; }));
        toon(); teller();
      });
      body.appendChild(titel);
      body.appendChild(maak('span', 'fav-card__meta', f.meta));
      body.appendChild(weg);
      kaart.appendChild(plaat); kaart.appendChild(body);
      bak.appendChild(kaart);
    });
  };

  toon();
  teller();
  window.addEventListener('storage', function (e) { if (e.key === KEY) { toon(); teller(); } });
})();
