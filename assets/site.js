// Comuna website. The map, pins, cards and calendar are ported from the app (third-space-app/index.html).
(() => {
  // Supabase (same project as the app). The publishable key is safe in the page;
  // site_messages only accepts inserts (see supabase/site_messages.sql).
  const SUPABASE_URL = 'https://sjxxiammvvfxcnukkqhg.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_sachUJlp8KvvBgCdg1fPGQ_cPmzOLzm';

  const C = { paper: '#F3E7D1', card: '#FBF6EA', ink: '#26251F', green: '#244D3A', red: '#C9533D', sun: '#D6A638', blue: '#4B66A8' };
  const CATS = {
    shows:   { label: 'Shows & Nightlife',   bg: '#4B66A8', fg: '#F3E7D1', ex: 'concerts, comedy, movies, DJ nights' },
    food:    { label: 'Food & Markets',      bg: '#C9533D', fg: '#F3E7D1', ex: 'tastings, food festivals, farmers and flea markets' },
    active:  { label: 'Active & Outdoors',   bg: '#244D3A', fg: '#F3E7D1', ex: 'run clubs, yoga, hikes, pickup games' },
    classes: { label: 'Classes & Community', bg: '#D6A638', fg: '#26251F', ex: 'workshops, talks, meetups, neighborhood events' }
  };
  const CAT_ICON = {
    shows: '<path d="M4 6.5h16a1.5 1.5 0 0 1 1.5 1.5v1.6a2.4 2.4 0 0 0 0 4.8V16a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 16v-1.6a2.4 2.4 0 0 0 0-4.8V8A1.5 1.5 0 0 1 4 6.5z"/><path d="M12 8.9v0M12 12v0M12 15.1v0" stroke-width="1.7"/>',
    food: '<path d="M7 2v20M4 2v6a3 3 0 0 0 6 0V2M17 22V2c-2.5 1-4 3.5-4 7v4h4"/>',
    active: '<path d="M7 2c1.7 0 2.7 2.2 2.7 4.9 0 2.6-1 4.6-2.7 4.6S4.3 9.5 4.3 6.9C4.3 4.2 5.3 2 7 2z"/><path d="M5.6 13.9h2.8v1.8a1.4 1.4 0 0 1-2.8 0z"/><g transform="translate(9.6 4)"><path d="M7 2c1.7 0 2.7 2.2 2.7 4.9 0 2.6-1 4.6-2.7 4.6S4.3 9.5 4.3 6.9C4.3 4.2 5.3 2 7 2z"/><path d="M5.6 13.9h2.8v1.8a1.4 1.4 0 0 1-2.8 0z"/></g>',
    classes: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>'
  };
  const catIcon = (k, s, c = CATS[k].fg) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${CAT_ICON[k]}</svg>`;
  const catDot = (k, d) => `<span class="catdot" style="width:${d}px;height:${d}px;background:${CATS[k].bg}">${catIcon(k, Math.round(d * .56))}</span>`;
  const vCheck = s => `<svg class="vcheck" width="${s}" height="${s}" viewBox="0 0 24 24" aria-label="Verified"><circle cx="12" cy="12" r="11" fill="${C.blue}"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const omark = (size, ring = C.sun, dot = C.red) => { const r = size / 2, sw = Math.max(2, size * .085); return `<svg width="${size}" height="${size}" viewBox="${-r} ${-r} ${size} ${size}" aria-hidden="true"><circle r="${r - sw / 2}" fill="none" stroke="${ring}" stroke-width="${sw}"/><circle r="${r * .42}" fill="none" stroke="${ring}" stroke-width="${sw * .8}"/><circle r="${r * .14}" fill="${dot}"/></svg>`; };

  // Example picks for the website's map. Illustrative only; the app shows live events.
  const ORIGIN = { lat: 34.0869, lng: -118.2702 }; // Silver Lake
  const PICKS = [
    { kind: 'Headliner', cat: 'shows', title: 'Club Nights at Los Globos', venue: 'Los Globos', when: 'Fri · 10 PM', mins: 3, lat: 34.0838, lng: -118.2757, big: true },
    { kind: 'Staple', cat: 'classes', title: 'Wednesday Trivia at 33 Taps', venue: '33 Taps Silver Lake', when: 'Wed · 8 PM', mins: 3, lat: 34.0893, lng: -118.2795 },
    { kind: 'Hidden Gem', cat: 'shows', title: 'Music and DJs at Tenants of the Trees', venue: 'Tenants of the Trees', when: 'Fri · 9 PM', mins: 3, lat: 34.0957, lng: -118.2732 },
    { kind: 'Pop-up', cat: 'food', title: 'Oktoberfest at Red Lion Tavern', venue: 'Red Lion Tavern', when: 'Today', mins: 5, lat: 34.0990, lng: -118.2610 }
  ];
  const HOODS = [
    { name: 'Silver Lake', lat: 34.0869, lng: -118.2702 }, { name: 'Echo Park', lat: 34.0782, lng: -118.2606 },
    { name: 'Los Feliz', lat: 34.1063, lng: -118.2848 }, { name: 'Frogtown', lat: 34.0985, lng: -118.2440 }
  ];
  const LANDMARKS = [
    { lat: 34.0925, lng: -118.2616, t: 'water', rx: .9, ry: .5 }, { lat: 34.0726, lng: -118.2606, t: 'water', rx: .45, ry: .3 },
    { lat: 34.0806, lng: -118.2436, t: 'park', rx: 1.2, ry: 1.0 }, { lat: 34.1300, lng: -118.2950, t: 'park', rx: 2.2, ry: 1.4 }
  ];
  function rng(seed) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
  const DOTS = (() => { const R = rng(11), cats = Object.keys(CATS); return Array.from({ length: 22 }, () => ({ lat: ORIGIN.lat + (R() - .5) * .05, lng: ORIGIN.lng + (R() - .5) * .06, cat: cats[Math.floor(R() * 4)] })); })();

  const pickCard = (p, i) => `<button class="pick" type="button" data-i="${i}"><div class="n">${catDot(p.cat, 34)}</div>
    <div><div class="when">${p.kind}</div><div class="t">${p.title}${vCheck(14)}</div><div class="m">${p.venue} · ${p.when}</div><div class="m2"><b>${p.when}</b> · ${p.venue}</div></div>
    <div class="dist">${p.mins}<small>min away</small></div></button>`;
  document.querySelectorAll('[data-picks]').forEach(el => { el.innerHTML = PICKS.map(pickCard).join(''); });

  // ---------- paper map (app paintPaper) ----------
  function projector(w, h, pts, ins) {
    const k = Math.cos(ORIGIN.lat * Math.PI / 180);
    let la0 = Math.min(...pts.map(p => p.lat)), la1 = Math.max(...pts.map(p => p.lat)), lo0 = Math.min(...pts.map(p => p.lng)), lo1 = Math.max(...pts.map(p => p.lng));
    const ih = h - ins.t - ins.b; let dLa = Math.max(la1 - la0, .012), dLo = Math.max((lo1 - lo0) * k, .012);
    const pad = .22, aspect = w / ih; if (dLo / dLa < aspect) dLo = dLa * aspect; else dLa = dLo / aspect;
    const cLa = (la0 + la1) / 2, cLo = (lo0 + lo1) / 2; dLa *= 1 + pad * 2; dLo *= 1 + pad * 2;
    return p => ({ x: ((p.lng - cLo) * k / dLo + .5) * w, y: (.5 - (p.lat - cLa) / dLa) * ih + ins.t });
  }
  function paintPaper(wrap) {
    const host = wrap.querySelector('.paper-map'); if (!host) return;
    const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return;
    const R = rng(7), proj = projector(w, h, [ORIGIN, ...PICKS], { t: 70, b: 150 });
    const pxPerMi = Math.abs(proj({ lat: ORIGIN.lat, lng: ORIGIN.lng + .0185 }).x - proj(ORIGIN).x) || 60;
    let s = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><rect width="${w}" height="${h}" fill="#EFE2C8"/>`;
    LANDMARKS.forEach(L => { const p = proj(L); s += `<ellipse cx="${p.x}" cy="${p.y}" rx="${L.rx * pxPerMi * .5}" ry="${L.ry * pxPerMi * .5}" fill="${L.t === 'water' ? '#AFC0D8' : '#C9D4B5'}"/>`; });
    const sp = Math.max(18, pxPerMi * .18);
    s += `<g stroke="#FBF6EA" stroke-width="2.2" transform="rotate(-12 ${w / 2} ${h / 2})">`;
    for (let x = -w; x < w * 2; x += sp * (0.8 + R() * 0.5)) s += `<line x1="${x}" y1="${-h}" x2="${x}" y2="${h * 2}"/>`;
    for (let y = -h; y < h * 2; y += sp * (0.8 + R() * 0.5)) s += `<line x1="${-w}" y1="${y}" x2="${w * 2}" y2="${y}"/>`;
    s += `</g><path d="M-10 ${h * .62} C${w * .3} ${h * .5} ${w * .55} ${h * .72} ${w + 10} ${h * .4}" fill="none" stroke="#fff" stroke-width="7"/><path d="M${w * .22} -10 C${w * .3} ${h * .4} ${w * .18} ${h * .7} ${w * .3} ${h + 10}" fill="none" stroke="#fff" stroke-width="5"/>`;
    HOODS.forEach(H => { const p = proj(H); if (p.x < 40 || p.x > w - 40 || p.y < 80 || p.y > h - 150) return; s += `<text x="${p.x}" y="${p.y - 24}" text-anchor="middle" font-family="Big Shoulders Display" font-weight="800" font-size="16" letter-spacing="2" fill="#26251F" opacity=".55">${H.name.toUpperCase()}</text>`; });
    host.innerHTML = s + '</svg>';
    const o = proj(ORIGIN); host.insertAdjacentHTML('beforeend', `<div class="youare" style="left:${o.x}px;top:${o.y}px">${omark(30)}</div>`);
    DOTS.forEach(d => { const p = proj(d); if (p.x < 6 || p.x > w - 6 || p.y < 60 || p.y > h - 140) return; host.insertAdjacentHTML('beforeend', `<span class="edot" style="left:${p.x}px;top:${p.y}px;background:${CATS[d.cat].bg}"></span>`); });
    PICKS.forEach((p, i) => { const q = proj(p); host.insertAdjacentHTML('beforeend', `<button type="button" class="pin${p.big ? ' big' : ''}" data-i="${i}" style="left:${q.x}px;top:${q.y}px;background:${CATS[p.cat].bg}" aria-label="${p.title}, ${CATS[p.cat].label}${p.big ? ', Headliner' : ''}">${catIcon(p.cat, 15)}</button>`); });
  }
  // ---------- live Mapbox map (same setup as the app's tryMapbox / styleMapbox) ----------
  // The token is locked to approved web addresses in Mapbox. Anywhere it isn't approved (or Mapbox can't load),
  // the paper map above stays, just like in the app.
  const MAPBOX_TOKEN = 'pk.eyJ1IjoibWl0Y2hlbGxraW1iYWxsOTQiLCJhIjoiY210dHNsenB6MDZxaDJ6cTNxamUxcTVybCJ9.1-J_H9klBRnP4I14GnPDxQ';
  const MAPBOX_JS = 'https://api.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl';
  const MAPCOL = { land: '#EFE2C8', water: '#AFC0D8', park: '#C9D4B5', building: '#E6D6B8', road: '#FBF6EA', major: '#FFFFFF', label: '#26251F', halo: '#F3E7D1', minorLabel: '#6B675A' };
  function styleMapbox(m) {
    (m.getStyle().layers || []).forEach(l => { const id = l.id; try {
      if (l.type === 'background') m.setPaintProperty(id, 'background-color', MAPCOL.land);
      else if (l.type === 'fill') {
        if (/water/.test(id)) m.setPaintProperty(id, 'fill-color', MAPCOL.water);
        else if (/landcover|hillshade/.test(id)) { m.setPaintProperty(id, 'fill-color', MAPCOL.land); m.setPaintProperty(id, 'fill-opacity', 0); }
        else if (id === 'landuse') { m.setPaintProperty(id, 'fill-color', ['match', ['get', 'class'], ['park', 'pitch', 'grass', 'cemetery', 'wood', 'scrub', 'golf_course', 'agriculture'], MAPCOL.park, 'rgba(239,226,200,0)']); m.setPaintProperty(id, 'fill-opacity', .85); }
        else if (/park|pitch|grass|wood|national|golf|cemetery/.test(id)) { m.setPaintProperty(id, 'fill-color', MAPCOL.park); m.setPaintProperty(id, 'fill-opacity', .8); }
        else if (/building/.test(id)) m.setPaintProperty(id, 'fill-color', MAPCOL.building);
        else m.setPaintProperty(id, 'fill-color', MAPCOL.land);
      } else if (l.type === 'line') {
        if (/water/.test(id)) m.setPaintProperty(id, 'line-color', MAPCOL.water);
        else if (/motorway|trunk|primary/.test(id)) m.setPaintProperty(id, 'line-color', MAPCOL.major);
        else if (/road|street|bridge|tunnel|path|secondary|tertiary/.test(id)) m.setPaintProperty(id, 'line-color', MAPCOL.road);
        else if (/admin|boundary/.test(id)) m.setLayoutProperty(id, 'visibility', 'none');
      } else if (l.type === 'symbol') {
        if (/poi|transit|airport|natural-point|water-point/.test(id)) m.setLayoutProperty(id, 'visibility', 'none');
        else { m.setPaintProperty(id, 'text-color', /road/.test(id) ? MAPCOL.minorLabel : MAPCOL.label); m.setPaintProperty(id, 'text-halo-color', MAPCOL.halo); m.setPaintProperty(id, 'text-halo-width', 1.4); }
        if (/settlement-subdivision|place-neighbo/.test(id)) m.setLayoutProperty(id, 'visibility', 'none');
      }
    } catch (e) {} });
    try {
      m.addSource('comuna-hoods', { type: 'geojson', data: { type: 'FeatureCollection', features: HOODS.map(h => ({ type: 'Feature', properties: { name: h.name.toUpperCase() }, geometry: { type: 'Point', coordinates: [h.lng, h.lat] } })) } });
      m.addLayer({ id: 'comuna-hood-labels', type: 'symbol', source: 'comuna-hoods', minzoom: 11, layout: { 'text-field': ['get', 'name'], 'text-font': ['DIN Pro Bold', 'Arial Unicode MS Bold'], 'text-size': ['interpolate', ['linear'], ['zoom'], 11, 11, 15, 15], 'text-letter-spacing': .25, 'text-offset': [0, -2.2] }, paint: { 'text-color': MAPCOL.label, 'text-opacity': .55, 'text-halo-color': MAPCOL.halo, 'text-halo-width': 1.5 } });
      m.addSource('comuna-dots', { type: 'geojson', data: { type: 'FeatureCollection', features: DOTS.map(d => ({ type: 'Feature', properties: { c: CATS[d.cat].bg }, geometry: { type: 'Point', coordinates: [d.lng, d.lat] } })) } });
      m.addLayer({ id: 'comuna-dots', type: 'circle', source: 'comuna-dots', paint: { 'circle-radius': 5.5, 'circle-color': ['get', 'c'], 'circle-stroke-width': 1.5, 'circle-stroke-color': MAPCOL.halo, 'circle-opacity': .85 } });
    } catch (e) {}
  }
  let mapboxLoad = null;
  const loadMapbox = () => mapboxLoad || (mapboxLoad = new Promise((res, rej) => {
    const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = MAPBOX_JS + '.css'; document.head.appendChild(css);
    const js = document.createElement('script'); js.src = MAPBOX_JS + '.js'; js.onload = res; js.onerror = rej; document.head.appendChild(js);
  }));
  function tryMapbox(wrap, select) {
    if (!MAPBOX_TOKEN || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(es => { if (!es.some(e => e.isIntersecting)) return; io.disconnect(); start(); }, { rootMargin: '400px' });
    io.observe(wrap);
    function start() {
      loadMapbox().then(() => {
        if (!window.mapboxgl || (mapboxgl.supported && !mapboxgl.supported())) return;
        mapboxgl.accessToken = MAPBOX_TOKEN;
        const el = document.createElement('div'); el.className = 'mbmap'; wrap.prepend(el);
        let done = false;
        const giveUp = () => { if (done) return; done = true; try { m.remove(); } catch (e) {} el.remove(); };
        const timer = setTimeout(giveUp, 8000);
        const m = new mapboxgl.Map({ container: el, style: 'mapbox://styles/mapbox/light-v11', center: [ORIGIN.lng, ORIGIN.lat], zoom: 13.6, attributionControl: false, logoPosition: 'top-left', pitchWithRotate: false, dragRotate: false, cooperativeGestures: true });
        m.addControl(new mapboxgl.AttributionControl({ compact: true }), 'top-right');
        m.on('error', ev => { const er = ev && ev.error; if (er && ([401, 403].includes(er.status) || /401|403|Forbidden|Unauthorized/i.test(String(er.message)))) { clearTimeout(timer); giveUp(); } });
        m.on('style.load', () => styleMapbox(m));
        m.once('idle', () => {
          clearTimeout(timer); if (done) return; done = true;
          const bounds = new mapboxgl.LngLatBounds(); [ORIGIN, ...PICKS].forEach(p => bounds.extend([p.lng, p.lat]));
          m.fitBounds(bounds, { padding: { top: 90, bottom: 170, left: 50, right: 50 }, maxZoom: 15, duration: 0 });
          const you = document.createElement('div'); you.className = 'youmk'; you.innerHTML = omark(30);
          new mapboxgl.Marker({ element: you }).setLngLat([ORIGIN.lng, ORIGIN.lat]).addTo(m);
          PICKS.forEach((p, i) => {
            const pin = document.createElement('button'); pin.type = 'button'; pin.className = 'pin' + (p.big ? ' big' : ''); pin.dataset.i = i;
            pin.style.background = CATS[p.cat].bg; pin.setAttribute('aria-label', `${p.title}, ${CATS[p.cat].label}${p.big ? ', Headliner' : ''}`); pin.innerHTML = catIcon(p.cat, 15);
            new mapboxgl.Marker({ element: pin }).setLngLat([p.lng, p.lat]).addTo(m);
          });
          wrap.classList.add('live');
          wrap.addEventListener('click', e => { const card = e.target.closest('.picks .pick'); if (card) { const p = PICKS[card.dataset.i]; m.easeTo({ center: [p.lng, p.lat], duration: 600 }); } });
          const tg = wrap.querySelector('.toggle button[data-mode="map"]'); if (tg) tg.addEventListener('click', () => setTimeout(() => m.resize(), 0));
        });
      }).catch(() => {});
    }
  }

  document.querySelectorAll('.mapwrap').forEach(wrap => {
    const select = i => {
      wrap.querySelectorAll('.pin').forEach(p => p.classList.toggle('sel', p.dataset.i === String(i)));
      wrap.querySelectorAll('.picks .pick').forEach(c => c.classList.toggle('hot', c.dataset.i === String(i)));
      const card = wrap.querySelector(`.picks .pick[data-i="${i}"]`);
      const row = wrap.querySelector('.picks');
      if (card && row && !wrap.classList.contains('list')) row.scrollTo({ left: card.offsetLeft - 14, behavior: 'smooth' });
    };
    wrap.addEventListener('click', e => {
      const t = e.target.closest('.pin, .picks .pick'); if (t) select(t.dataset.i);
      const tg = e.target.closest('.toggle button');
      if (tg) {
        wrap.classList.toggle('list', tg.dataset.mode === 'list');
        wrap.querySelectorAll('.toggle button').forEach(b => b.classList.toggle('on', b === tg));
        if (tg.dataset.mode === 'map') paintPaper(wrap);
      }
    });
    paintPaper(wrap);
    let t; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => paintPaper(wrap), 120); });
    tryMapbox(wrap, select);
  });

  // ---------- map key + interests ----------
  document.querySelectorAll('[data-lgcats]').forEach(el => { el.innerHTML = Object.keys(CATS).map(k => `<span>${catDot(k, 26)}${CATS[k].label}</span>`).join(''); });
  document.querySelectorAll('[data-pin]').forEach(el => { const k = el.dataset.pin; el.innerHTML = `<span class="pin${el.hasAttribute('data-big') ? ' big' : ''}" style="background:${CATS[k].bg}">${catIcon(k, 15)}</span>`; });
  document.querySelectorAll('[data-interests]').forEach(el => {
    el.innerHTML = Object.keys(CATS).map((k, i) => `<button type="button" aria-pressed="${i < 2}">${catDot(k, 40)}<span>${CATS[k].label}<small>${CATS[k].ex}</small></span></button>`).join('');
  });
  document.querySelectorAll('[data-catdot]').forEach(el => { el.innerHTML = catDot(el.dataset.catdot, +el.dataset.size || 40); });
  document.addEventListener('click', e => {
    const b = e.target.closest('.interests button, .tagpick button');
    if (b) b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true');
    const m = e.target.closest('.moods button');
    if (m) m.parentElement.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === m));
  });

  // ---------- plans calendar ----------
  document.querySelectorAll('[data-cal]').forEach(root => {
    const now = new Date(); now.setHours(0, 0, 0, 0);
    let view = new Date(now.getFullYear(), now.getMonth(), 1);
    const grid = root.querySelector('.calgrid'), month = root.querySelector('.calhead .m'), head = root.querySelector('.dayhead');
    const draw = () => {
      month.textContent = view.toLocaleString('en-US', { month: 'long' });
      const first = view.getDay(), days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
      let html = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<div class="wd">${d}</div>`).join('');
      html += '<div></div>'.repeat(first);
      for (let d = 1; d <= days; d++) {
        const date = new Date(view.getFullYear(), view.getMonth(), d), diff = Math.round((date - now) / 864e5);
        const cls = diff < 0 ? 'past' : diff === 0 ? 'today' : diff === 2 ? 'mine' : '';
        const dot = diff >= 0 && diff < 14 && [0, 1, 3, 4, 6, 8, 9, 12].includes(diff) ? '<i></i>' : '';
        html += `<div class="day ${cls}"><span>${d}</span>${dot}</div>`;
      }
      grid.innerHTML = html;
    };
    const ord = n => n + (['th', 'st', 'nd', 'rd'][(n % 100 - 20) % 10] || ['th', 'st', 'nd', 'rd'][n % 100] || 'th');
    head.innerHTML = `${now.toLocaleString('en-US', { weekday: 'long' })} <span>${now.toLocaleString('en-US', { month: 'long' })} ${ord(now.getDate())}</span>`;
    root.querySelector('[data-prev]').onclick = () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); draw(); };
    root.querySelector('[data-next]').onclick = () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); draw(); };
    root.querySelector('[data-today]').onclick = () => { view = new Date(now.getFullYear(), now.getMonth(), 1); draw(); };
    draw();
  });

  // ---------- passport tabs ----------
  document.querySelectorAll('[role="tablist"]').forEach(list => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const show = tab => tabs.forEach(t => { const on = t === tab; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; document.getElementById(t.getAttribute('aria-controls')).hidden = !on; });
    list.addEventListener('click', e => { const t = e.target.closest('[role="tab"]'); if (t) show(t); });
    list.addEventListener('keydown', e => {
      const i = tabs.indexOf(document.activeElement); if (i < 0) return;
      const n = e.key === 'ArrowRight' ? (i + 1) % tabs.length : e.key === 'ArrowLeft' ? (i - 1 + tabs.length) % tabs.length : -1;
      if (n >= 0) { e.preventDefault(); show(tabs[n]); tabs[n].focus(); }
    });
  });

  // ---------- chrome ----------
  const bar = document.querySelector('.topbar');
  const onScroll = () => bar && bar.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  } else reveals.forEach(el => el.classList.add('in'));

  // ---------- forms ----------
  document.querySelectorAll('form[data-form]').forEach(form => {
    const status = form.querySelector('.form-status'), button = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      if (data.website) return; // honeypot
      delete data.website;
      form.querySelectorAll('[data-pick]').forEach(g => { data[g.dataset.pick] = [...g.querySelectorAll('[aria-pressed="true"]')].map(b => b.dataset.v || b.textContent.trim()).join(', '); });
      const missing = [...form.querySelectorAll('[required]')].find(f => !f.value.trim());
      if (missing) { status.textContent = 'Please fill in the required fields.'; missing.focus(); return; }
      const email = form.querySelector('[type="email"]');
      if (email && !email.checkValidity()) { status.textContent = 'That email doesn\'t look quite right.'; email.focus(); return; }
      button.disabled = true; status.textContent = 'Sending…';
      try {
        const { name, email: mail, message, ...details } = data;
        const res = await fetch(`${SUPABASE_URL}/rest/v1/site_messages`, {
          method: 'POST',
          headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
          body: JSON.stringify({ kind: form.dataset.form, name, email: mail, message: message || null, details, page: location.pathname })
        });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        form.querySelectorAll('[aria-pressed="true"]').forEach(b => b.setAttribute('aria-pressed', 'false'));
        status.textContent = form.dataset.form === 'host' ? 'Got it! We\'ll be in touch within a few days.' : 'Thanks! It\'s on its way to us.';
      } catch {
        status.textContent = 'That didn\'t send. Try again, or DM us on Instagram @comuna.events.';
      } finally { button.disabled = false; }
    });
  });
})();
