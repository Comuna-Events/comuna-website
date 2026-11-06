// Comuna website. The map, pins, cards and calendar are ported from the app (third-space-app/index.html).
(() => {
  // Supabase (same project as the app). The publishable key is safe in the page;
  // site_messages only accepts inserts (see supabase/site_messages.sql).
  const SUPABASE_URL = 'https://sjxxiammvvfxcnukkqhg.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_sachUJlp8KvvBgCdg1fPGQ_cPmzOLzm';

  const C = { paper: '#F3EBDD', card: '#FAF6EE', ink: '#353A32', green: '#315C49', red: '#B85A38', sun: '#D5AE64', blue: '#5F7E8A', muted: '#6B6E64' };
  const CATS = {
  food:      { label:'Food & Drink',         short:'Food',    bg:'#C9533D', fg:'#F3E7D1', ex:'tastings, food festivals, supper clubs, wine nights' },
  shows:      { label:'Arts & Entertainment', short:'Arts',    bg:'#4B66A8', fg:'#F3E7D1', ex:'concerts, comedy, movies, galleries, DJ nights' },
  classes:   { label:'Classes & Workshops',  short:'Classes', bg:'#D6A638', fg:'#26251F', ex:'workshops, classes, talks, author readings' },
  active:    { label:'Active & Outdoors',    short:'Active',  bg:'#244D3A', fg:'#F3E7D1', ex:'run clubs, yoga, hikes, pickup games' },
  markets:   { label:'Markets & Shopping',   short:'Markets', bg:'#26251F', fg:'#F3E7D1', ex:'farmers markets, flea markets, makers fairs' },
  community: { label:'Community & Social',   short:'Social',  bg:'#E08A6E', fg:'#26251F', ex:'meetups, neighborhood festivals, volunteering' }
};
  const CAT_ICON={
  food:'<path d="M7 2v20M4 2v6a3 3 0 0 0 6 0V2M17 22V2c-2.5 1-4 3.5-4 7v4h4"/>',
  shows:'<path d="M4 6.5h16a1.5 1.5 0 0 1 1.5 1.5v1.6a2.4 2.4 0 0 0 0 4.8V16a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 16v-1.6a2.4 2.4 0 0 0 0-4.8V8A1.5 1.5 0 0 1 4 6.5z"/><path d="M12 8.9v0M12 12v0M12 15.1v0" stroke-width="1.7"/>',
  classes:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
  active:'<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>',
  markets:'<path d="M4.5 8h15l-1.1 12.5a1.5 1.5 0 0 1-1.5 1.4H7.1a1.5 1.5 0 0 1-1.5-1.4z"/><path d="M8.8 10.5V6.4a3.2 3.2 0 0 1 6.4 0v4.1"/>',
  community:'<path d="M12 .8v2.4M7 2.6l1.3 1.9M17 2.6l-1.3 1.9" stroke-width="2"/><g fill="currentColor" stroke="none"><circle cx="12" cy="9" r="3.4"/><path d="M5.8 22.5v-2.1a5.1 5.1 0 0 1 5.1-5.1h2.2a5.1 5.1 0 0 1 5.1 5.1v2.1z"/><circle cx="4.6" cy="11.4" r="2.5"/><path d="M0 20.6v-1.2a3.6 3.6 0 0 1 3.6-3.6h2.6a6.8 6.8 0 0 0-1.6 4.4v.4z"/><circle cx="19.4" cy="11.4" r="2.5"/><path d="M24 20.6v-1.2a3.6 3.6 0 0 0-3.6-3.6h-2.6a6.8 6.8 0 0 1 1.6 4.4v.4z"/></g>'
};
  const catIcon = (k, s, c = CATS[k].fg) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" color="${c}" stroke="${c}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${CAT_ICON[k]}</svg>`;
  const catDot = (k, d) => `<span class="catdot" style="width:${d}px;height:${d}px;background:${CATS[k].bg}">${catIcon(k, Math.round(d * .56))}</span>`;
  const vCheck = s => `<svg class="vcheck" width="${s}" height="${s}" viewBox="0 0 24 24" aria-label="Verified"><circle cx="12" cy="12" r="11" fill="${C.blue}"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const omark = (size, ring = C.sun, dot = C.red) => { const r = size / 2, sw = Math.max(1.5, size * .085); return `<svg width="${size}" height="${size}" viewBox="${-r} ${-r} ${size} ${size}" overflow="visible" aria-hidden="true"><circle r="${r - sw / 2}" fill="none" stroke="${ring}" stroke-width="${sw}"/><circle r="${r * .42}" fill="none" stroke="${ring}" stroke-width="${sw * .8}"/><circle r="${r * .14}" fill="${dot}"/></svg>`; };


  // ---------- place stamps (app placeStamp, copied as is) ----------
  // Passport entry stamps drawn in code, one shape per kind of place. Ink: terracotta, ochre, dusty blue, green and charcoal.
  const escH = t => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const STAMP_INK = { food: '#B5583A', shows: '#5F7E8A', arts: '#5F7E8A', classes: '#353A32', active: '#315C49', markets: '#A9843A', community: '#B5583A' };
  const STAMP_DATE_INK = { food: '#353A32', community: '#353A32' }, STAMP_RED = '#B5583A';
  let stampUid = 0;
  const stampPlaceName = name => { const full = String(name || '').trim(), short = full.replace(/\s*\(.*?\)\s*/g, ' ').split(/ [-–—] | \/ |, /)[0].trim(); return short.length > 2 ? short : full; };
  function placeStamp(name,hood,cat,n,rot,w=150,h,ink,o={}){
  const kind=STAMP_INK[cat]? (cat==='shows'?'arts':cat) : 'community', c=ink||STAMP_INK[kind], dc=ink||STAMP_DATE_INK[kind]||STAMP_RED;
  const id='ps'+(stampUid++), H=String(hood||'').toUpperCase(), N=stampPlaceName(name).toUpperCase(), A=o.area||'';
  const V=n? `№ ${String(n).padStart(2,'0')}` : '', date=o.days||o.date||'', when=[date,o.days?'':o.time].filter(Boolean).join(' · '), time=o.days?'':(o.time||'');
  const fit=(t,per,max)=>t.length*per>max? `textLength="${max}" lengthAdjust="spacingAndGlyphs"` : '';
  const lines=(t,max)=>{ const ws=t.split(/\s+/); if(t.length<=max||ws.length<2) return [t]; let best=[t], diff=1e9;
    for(let i=1;i<ws.length;i++){ const a=ws.slice(0,i).join(' '), b=ws.slice(i).join(' '), d=Math.abs(a.length-b.length); if(d<diff){ diff=d; best=[a,b]; } } return best; };
  const dots=(cx,cy,r,k=12)=>Array.from({length:k},(_,i)=>{ const a=i/k*2*Math.PI; return `<circle cx="${(cx+r*Math.cos(a)).toFixed(1)}" cy="${(cy+r*Math.sin(a)).toFixed(1)}" r="1.5" stroke="none"/>`; }).join('');
  const arrow=(x,y)=>`<g fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M${x+12} ${y} h14 v22 h-14"/><path d="M${x} ${y+11} h17 m-6 -6 l6 6 l-6 6"/></g>`;
  const star=(x,y,s=4)=>{ const p=[]; for(let i=0;i<10;i++){ const r=i%2?s*.45:s, a=-Math.PI/2+i*Math.PI/5; p.push(`${(x+r*Math.cos(a)).toFixed(1)},${(y+r*Math.sin(a)).toFixed(1)}`); } return `<polygon points="${p.join(' ')}" stroke="none"/>`; };
  const D='stroke="none" font-family="Big Shoulders Display" font-weight="800"', S='stroke="none" font-family="DM Sans" font-weight="700"';
  let vb='0 0 260 170', body='';
  if(kind==='arts'){            // rounded box, dotted LA ring with the area code beside it, visit-number box
    const L=lines(N,16);
    body=`<rect x="5" y="5" width="250" height="160" rx="14" fill="none" stroke-width="4"/>
      ${dots(38,38,17)}<text x="38" y="44" text-anchor="middle" ${S} font-size="15">LA</text><text x="66" y="44" ${S} font-size="17" letter-spacing="1">${A}</text>
      ${V?`<rect x="168" y="20" width="72" height="34" rx="5" fill="none" stroke-width="2.6"/><text x="204" y="44" text-anchor="middle" ${S} font-size="16" letter-spacing="1">${V}</text>`:''}
      <text x="22" y="86" ${S} font-size="${time?17:21}" fill="${dc}">${escH(when)}</text>
      <text x="238" y="104" text-anchor="end" ${S} font-size="13" letter-spacing="1.5" ${fit(H,9,150)}>${escH(H)}</text>
      ${arrow(20,128)}${L.map((t,i)=>`<text x="238" y="${L.length>1?132+i*24:146}" text-anchor="end" ${D} font-size="${L.length>1?24:26}" letter-spacing=".5" ${fit(t,13,170)}>${escH(t)}</text>`).join('')}`;
  } else if(kind==='food'){     // octagon with ruled lines, like an airport arrival stamp
    vb='0 0 260 190'; const L=lines(N,14), foot=[H,A].filter(Boolean).join(' · ');
    body=`<polygon points="78,6 182,6 254,62 254,128 182,184 78,184 6,128 6,62" fill="none" stroke-width="4" stroke-linejoin="round"/>
      <polygon points="83,15 177,15 244,66 244,124 177,175 83,175 16,124 16,66" fill="none" stroke-width="1.6" stroke-linejoin="round"/>
      ${V?`<text x="130" y="36" text-anchor="middle" ${S} font-size="12" letter-spacing="2">${V}</text>`:''}
      <text x="130" y="56" text-anchor="middle" ${S} font-size="${time?17:20}" fill="${dc}">${escH(when)}</text><line x1="40" y1="66" x2="220" y2="66" stroke-width="2.2"/>
      ${L.map((t,i)=>`<text x="130" y="${L.length>1?95+i*27:108}" text-anchor="middle" ${D} font-size="28" ${fit(t,15,190)}>${escH(t)}</text>`).join('')}
      <line x1="40" y1="${L.length>1?132:124}" x2="220" y2="${L.length>1?132:124}" stroke-width="2.2"/>
      <text x="130" y="${L.length>1?156:150}" text-anchor="middle" ${S} font-size="12.5" letter-spacing="2" ${fit(foot,9.5,140)}>${escH(foot)}</text>`;
  } else if(kind==='classes'){  // double frame like an ARRIVAL stamp: the check-in time sits top right
    const L=lines(N,15);
    body=`<rect x="5" y="5" width="250" height="160" rx="12" fill="none" stroke-width="4"/><rect x="22" y="38" width="216" height="96" rx="8" fill="none" stroke-width="2.6"/>
      <text x="24" y="27" ${S} font-size="12.5" letter-spacing="2">CLASS${A?' · '+A:''}</text><text x="236" y="27" text-anchor="end" ${S} font-size="12.5" letter-spacing="1">${time}</text>
      ${arrow(34,52)}<text x="78" y="70" ${S} font-size="19" fill="${dc}">${escH(date)}</text>${V?`<text x="226" y="70" text-anchor="end" ${S} font-size="13" letter-spacing="1">${V}</text>`:''}
      ${L.map((t,i)=>`<text x="130" y="${L.length>1?100+i*25:114}" text-anchor="middle" ${D} font-size="26" ${fit(t,14,200)}>${escH(t)}</text>`).join('')}
      ${star(48,151)}${star(62,151)}${star(76,151)}${star(184,151)}${star(198,151)}${star(212,151)}
      <text x="130" y="156" text-anchor="middle" ${S} font-size="12" letter-spacing="1.5" ${fit(H,8.5,90)}>${escH(H)}</text>`;
  } else if(kind==='active'){   // triangle: date and time up one side, area code in the middle ring
    vb='0 0 260 230';
    body=`<defs><path id="${id}l" d="M30 205 L130 22"/><path id="${id}r" d="M130 22 L230 205"/></defs>
      <polygon points="130,8 252,220 8,220" fill="none" stroke-width="4" stroke-linejoin="round"/><polygon points="130,84 192,192 68,192" fill="none" stroke-width="2.4" stroke-linejoin="round"/>
      <text ${S} font-size="12.5" letter-spacing="1.5" fill="${dc}" dy="17"><textPath href="#${id}l" startOffset="${time?12:22}%">${escH(date)}${time?' ★ '+time:''}</textPath></text>
      <text ${S} font-size="12.5" letter-spacing="2" dy="17"><textPath href="#${id}r" startOffset="12%">${V||'ACTIVE'} ★ ${escH(H)}</textPath></text>
      ${dots(130,158,19,14)}<text x="130" y="164" text-anchor="middle" ${S} font-size="15">${A||'LA'}</text>
      <text x="130" y="212" text-anchor="middle" ${D} font-size="16" letter-spacing=".5" ${fit(N,9.2,214)}>${escH(N)}</text>`;
  } else if(kind==='markets'){  // ticket stamp: notched corners, header bar with the area code, dotted ring
    const L=lines(N,17);
    body=`<path d="M22 5 H238 A17 17 0 0 0 255 22 V148 A17 17 0 0 0 238 165 H22 A17 17 0 0 0 5 148 V22 A17 17 0 0 0 22 5 Z" fill="none" stroke-width="4"/>
      <line x1="16" y1="44" x2="244" y2="44" stroke-width="2.2"/><text x="130" y="33" text-anchor="middle" ${S} font-size="13.5" letter-spacing="3">MARKET DAY${A?' · '+A:''}</text>
      ${dots(42,78,16)}<text x="42" y="84" text-anchor="middle" ${S} font-size="14">LA</text>
      <text x="70" y="86" ${S} font-size="${time?17:21}" fill="${dc}">${escH(when)}</text>${V?`<text x="238" y="86" text-anchor="end" ${S} font-size="14" letter-spacing="1">${V}</text>`:''}
      ${L.map((t,i)=>`<text x="130" y="${L.length>1?114+i*24:126}" text-anchor="middle" ${D} font-size="25" ${fit(t,13.5,215)}>${escH(t)}</text>`).join('')}
      <text x="130" y="156" text-anchor="middle" ${S} font-size="11.5" letter-spacing="2" ${fit(H,8,160)}>• ${escH(H)} •</text>`;
  } else {                      // community: round seal, neighborhood and area code around the ring
    vb='0 0 220 220'; const L=lines(N,11), ring=[H,'COMMUNITY',A].filter(Boolean).join(' ★ ');
    body=`<defs><path id="${id}c" d="M110 110 m-80 0 a80 80 0 1 1 160 0 a80 80 0 1 1 -160 0"/></defs>
      <circle cx="110" cy="110" r="104" fill="none" stroke-width="4"/><circle cx="110" cy="110" r="70" fill="none" stroke-width="2.2"/>
      <text ${S} font-size="13.5" letter-spacing="3"><textPath href="#${id}c" startOffset="54%" text-anchor="middle">${escH(ring)}</textPath></text>
      <text x="110" y="${L.length>1?88:96}" text-anchor="middle" ${S} font-size="${time?13:17}" fill="${dc}">${escH(when)}</text>
      ${L.map((t,i)=>`<text x="110" y="${L.length>1?116+i*24:126}" text-anchor="middle" ${D} font-size="25" ${fit(t,13.5,122)}>${escH(t)}</text>`).join('')}
      ${V?`<text x="110" y="${L.length>1?160:152}" text-anchor="middle" ${S} font-size="12.5" letter-spacing="1.5">★ ${V} ★</text>`:`${star(96,L.length>1?160:150)}${star(110,L.length>1?160:150)}${star(124,L.length>1?160:150)}`}`;
  }
  const [,,vw,vh]=vb.split(' ').map(Number), seed=stampUid%89;
  return `<div class="pstamp" style="width:${w}px;transform:rotate(${rot}deg)" role="img" aria-label="${escH(name)} stamp, ${escH(hood)}${V?', visit '+n:''}">
  <svg viewBox="${vb}" width="100%" height="${(w*vh/vw).toFixed(0)}" aria-hidden="true" style="overflow:visible"><defs><filter id="${id}f" x="-4%" y="-4%" width="108%" height="108%">
    <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${seed}" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="1.6" result="d"/>
    <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="${seed+3}" result="sp"/><feColorMatrix in="sp" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.6 2.05" result="m"/>
    <feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="2" seed="${seed+7}" result="bl"/><feColorMatrix in="bl" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.4 1.75" result="m2"/>
    <feComposite in="d" in2="m" operator="in" result="a"/><feComposite in="a" in2="m2" operator="in"/></filter></defs>
  <g filter="url(#${id}f)" fill="${c}" stroke="${c}" opacity=".92">${body}</g></svg></div>`;
}
  // <div data-stamp="Venue|Neighborhood|category" data-rot="-6" data-w="170" data-days="SUNDAYS" data-area="323" data-n="2" data-date="10.31.26" data-time="19:05">
  document.querySelectorAll('[data-stamp]').forEach(el => {
    const [name, hood, cat] = el.dataset.stamp.split('|'), d = el.dataset;
    el.innerHTML = placeStamp(name, hood, cat, +d.n || 0, +d.rot || 0, +d.w || 160, null, null, { days: d.days, area: d.area, date: d.date, time: d.time });
  });

  // Example picks for the website's map. Illustrative only; the app shows live events.
  const ORIGIN = { lat: 34.0869, lng: -118.2702 }; // Silver Lake
  const PICKS = [
    // why: the reason the app's "Tonight in …" card gives; sig: the line under it; moods: which mood chips it fits
    { kind: 'Headliner', why: 'Headliner', sig: 'Dance · Late night', moods: ['late', 'social'], price: '$15', cat: 'shows', title: 'Club Nights at Los Globos', venue: 'Los Globos', when: 'Fri · 10 PM', time: '10 PM', mins: 3, lat: 34.0838, lng: -118.2757, big: true },
    { kind: 'Weekly', why: 'Weekly', sig: 'Social · Solo-friendly', moods: ['social', 'chill', 'cheap'], price: 'Free', cat: 'community', title: 'Wednesday Trivia at 33 Taps', venue: '33 Taps Silver Lake', when: 'Wed · 8 PM', time: '8 PM', mins: 3, lat: 34.0893, lng: -118.2795 },
    { kind: 'Hidden Gem', why: 'Just dropped', sig: 'Added 3 hours ago', moods: ['chill', 'late'], price: 'Free', cat: 'shows', title: 'Music and DJs at Tenants of the Trees', venue: 'Tenants of the Trees', when: 'Fri · 9 PM', time: '9 PM', mins: 3, lat: 34.0957, lng: -118.2732 },
    { kind: 'Pop-up', why: 'Last chance', sig: 'Festive · Outdoors', moods: ['social', 'cheap'], price: 'Free', cat: 'food', title: 'Oktoberfest at Red Lion Tavern', venue: 'Red Lion Tavern', when: 'Today', time: '6 PM', mins: 5, lat: 34.0990, lng: -118.2610 }
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
  const DOTS = (() => { const R = rng(11), cats = Object.keys(CATS); return Array.from({ length: 22 }, () => ({ lat: ORIGIN.lat + (R() - .5) * .05, lng: ORIGIN.lng + (R() - .5) * .06, cat: cats[Math.floor(R() * cats.length)] })); })();

  const pickCard = (p, i) => `<button class="pick" type="button" data-i="${i}"><div class="n">${catDot(p.cat, 34)}</div>
    <div><div class="when">${p.kind}</div><div class="t">${p.title}${vCheck(14)}</div><div class="m">${p.venue} · ${p.when}</div><div class="m2"><b>${p.when}</b> · ${p.venue}</div></div>
    <div class="dist">${p.mins}<small>min away</small></div></button>`;
  document.querySelectorAll('[data-picks]').forEach(el => { el.innerHTML = PICKS.map(pickCard).join(''); });

  // ---------- "Tonight in …" (the app's daily picks card): a reason above each pick, a mood row, "Not for me" ----------
  document.querySelectorAll('[data-tonight]').forEach(box => {
    const list = box.querySelector('.reclist'), sum = box.querySelector('.recsum'), nope = new Set();
    let mood = '';
    const row = (p, i) => `<div class="pickrow" data-i="${i}"><div class="pickhd"><span>${p.why}</span><button type="button" class="nope" aria-label="Not for me: ${escH(p.title)}">Not for me</button></div>
      <div class="pick"><div><div class="t">${escH(p.title)}${vCheck(14)}</div><div class="m">${[p.venue, p.time, p.price].join(' · ')}</div><div class="sig">${p.sig}</div></div><div class="dist">${p.mins}<small>min away</small></div></div></div>`;
    const draw = () => {
      const shown = PICKS.map((p, i) => [p, i]).filter(([p, i]) => !nope.has(i) && (!mood || p.moods.includes(mood)));
      sum.textContent = shown.length ? `${shown.length} ${shown.length === 1 ? 'pick' : 'picks'} for tonight.` : '';
      list.innerHTML = shown.length ? shown.map(([p, i]) => row(p, i)).join('') : `<p class="recnone">Nothing nearby fits that tonight. Try another one${nope.size ? ', or <button type="button" class="linkish" data-reset>bring the picks back</button>' : ''}.</p>`;
    };
    box.addEventListener('click', e => {
      const c = e.target.closest('[data-mood]');
      if (c) { mood = c.dataset.mood; box.querySelectorAll('[data-mood]').forEach(b => { const on = b === c; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); }); draw(); }
      const n = e.target.closest('.nope');
      if (n) { const r = n.closest('.pickrow'); nope.add(+r.dataset.i); r.classList.add('gone'); setTimeout(draw, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 220); }
      if (e.target.closest('[data-reset]')) { nope.clear(); draw(); }
    });
    const k = box.querySelector('[data-today]');
    if (k) k.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    draw();
  });

  // ---------- paper map (app paintPaper) ----------
  function projector(w, h, pts, ins) {
    const k = Math.cos(ORIGIN.lat * Math.PI / 180);
    let la0 = Math.min(...pts.map(p => p.lat)), la1 = Math.max(...pts.map(p => p.lat)), lo0 = Math.min(...pts.map(p => p.lng)), lo1 = Math.max(...pts.map(p => p.lng));
    const ih = h - ins.t - ins.b; let dLa = Math.max(la1 - la0, .012), dLo = Math.max((lo1 - lo0) * k, .012);
    const pad = .22, aspect = w / ih; if (dLo / dLa < aspect) dLo = dLa * aspect; else dLa = dLo / aspect;
    const cLa = (la0 + la1) / 2, cLo = (lo0 + lo1) / 2; dLa *= 1 + pad * 2; dLo *= 1 + pad * 2;
    return p => ({ x: ((p.lng - cLo) * k / dLo + .5) * w, y: (.5 - (p.lat - cLa) / dLa) * ih + ins.t });
  }
  // the hand-drawn map's inks (app SK / INK): paper land, ink-outlined streets, watercolor water and parks
  const INK = '#353A32', SK = { land: '#F2EADA', road: '#FBF7EE', major: '#FFFDF8', water: '#BCD0D6', waterInk: '#6F8E99', park: '#CDD6B8', parkInk: '#7D9468' };
  const HAND_FONT = "'Patrick Hand SC', 'Caveat', cursive";
  // a pin's name tag sits on its left instead when it would run past the map's right edge (app fitTag)
  function fitTag(pin) { const t = pin.querySelector('.tag'), wrap = pin.closest('.mapwrap'); if (!t || !wrap) return; t.classList.remove('flip');
    if (t.getBoundingClientRect().right > wrap.getBoundingClientRect().right - 6) t.classList.add('flip'); }
  function paintPaper(wrap) {
    const host = wrap.querySelector('.paper-map'); if (!host) return;
    const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return;
    const R = rng(7), proj = projector(w, h, [ORIGIN, ...PICKS], { t: 70, b: 150 }), selected = wrap.dataset.sel;
    const pxPerMi = Math.abs(proj({ lat: ORIGIN.lat, lng: ORIGIN.lng + .0185 }).x - proj(ORIGIN).x) || 60;
    let s = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><rect width="${w}" height="${h}" fill="${SK.land}"/>`;
    const sp = Math.max(18, pxPerMi * .18);
    // streets: an ink outline with paper inside, like a pen-drawn street
    let lines = '';
    for (let x = -w; x < w * 2; x += sp * (0.8 + R() * 0.5)) lines += `<line x1="${x}" y1="${-h}" x2="${x}" y2="${h * 2}"/>`;
    for (let y = -h; y < h * 2; y += sp * (0.8 + R() * 0.5)) lines += `<line x1="${-w}" y1="${y}" x2="${w * 2}" y2="${y}"/>`;
    s += `<g transform="rotate(-12 ${w / 2} ${h / 2})"><g stroke="${INK}" stroke-opacity=".22" stroke-width="4">${lines}</g><g stroke="${SK.road}" stroke-width="2.6">${lines}</g></g>`;
    // lakes and parks drawn over the street grid, with an inked edge
    LANDMARKS.forEach(L => { const p = proj(L), water = L.t === 'water'; s += `<ellipse cx="${p.x}" cy="${p.y}" rx="${L.rx * pxPerMi * .5}" ry="${L.ry * pxPerMi * .5}" fill="${water ? SK.water : SK.park}" stroke="${water ? SK.waterInk : SK.parkInk}" stroke-opacity="${water ? .9 : .4}" stroke-width="${water ? 1.4 : 1}"/>`; });
    const road = (d, wd) => `<path d="${d}" fill="none" stroke="${INK}" stroke-opacity=".55" stroke-width="${wd + 2.4}"/><path d="${d}" fill="none" stroke="${SK.major}" stroke-width="${wd}"/>`;
    s += road(`M-10 ${h * .62} C${w * .3} ${h * .5} ${w * .55} ${h * .72} ${w + 10} ${h * .4}`, 7) + road(`M${w * .22} -10 C${w * .3} ${h * .4} ${w * .18} ${h * .7} ${w * .3} ${h + 10}`, 5);
    HOODS.forEach(H => { const p = proj(H); if (p.x < 40 || p.x > w - 40 || p.y < 80 || p.y > h - 150) return;
      s += `<text x="${p.x}" y="${p.y - 24}" text-anchor="middle" font-family="${HAND_FONT.replace(/"/g, '')}" font-size="21" letter-spacing="2" fill="${INK}" stroke="${SK.land}" stroke-opacity=".92" stroke-width="6" stroke-linejoin="round" paint-order="stroke">${H.name.toUpperCase()}</text>`; });
    host.innerHTML = s + '</svg>';
    const o = proj(ORIGIN); host.insertAdjacentHTML('beforeend', `<div class="youare" style="left:${o.x}px;top:${o.y}px">${omark(30)}</div>`);
    DOTS.forEach(d => { const p = proj(d); if (p.x < 6 || p.x > w - 6 || p.y < 60 || p.y > h - 140) return; host.insertAdjacentHTML('beforeend', `<span class="edot" style="left:${p.x}px;top:${p.y}px;background:${CATS[d.cat].bg}"></span>`); });
    PICKS.forEach((p, i) => { const q = proj(p); host.insertAdjacentHTML('beforeend', `<span class="pinat" style="left:${q.x}px;top:${q.y}px">${pinHtml(p, i, String(i) === selected)}</span>`); });
    host.querySelectorAll('.pin.sel').forEach(fitTag);
  }
  // an event pin in the hand-drawn style: inked circle in the category's colour; the chosen one becomes a drawn map pin with its name tag
  const pinHtml = (p, i, sel) => `<button type="button" class="pin${p.big ? ' big' : ''}${sel ? ' sel' : ''}" data-i="${i}" style="background:${CATS[p.cat].bg};--pc:${CATS[p.cat].bg}" aria-label="${escH(p.title)}, ${CATS[p.cat].label}${p.big ? ', Headliner' : ''}">${catIcon(p.cat, 15)}${sel ? `<span class="tag">${escH(p.venue)}</span>` : ''}</button>`;
  // ---------- live Mapbox map (same setup as the app's tryMapbox / styleMapbox) ----------
  // The website's own token (cpicke21's Mapbox account), locked to the site's web addresses in Mapbox. Anywhere it isn't approved (or Mapbox can't load),
  // the paper map above stays, just like in the app.
  const MAPBOX_TOKEN = 'pk.eyJ1IjoiY3BpY2tlMjEiLCJhIjoiY212OGxiY20zMDFyOTJ4b292ODI4OWw2ZiJ9.N20uJkYXczHjHmyhV97YtA';
  const MAPBOX_JS = 'https://api.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl';
  const MAPCOL = { land: '#EAE0CE', water: '#C3D1D6', park: '#CBD5C4', building: '#E2D7C3', road: '#FAF6EE', major: '#FFFFFF', label: '#353A32', halo: '#F3EBDD', minorLabel: '#6B6E64' };
  function styleMapbox(m) {
    (m.getStyle().layers || []).forEach(l => { const id = l.id; try {
      if (l.type === 'background') m.setPaintProperty(id, 'background-color', MAPCOL.land);
      else if (l.type === 'fill') {
        if (/water/.test(id)) m.setPaintProperty(id, 'fill-color', MAPCOL.water);
        else if (/landcover|hillshade/.test(id)) { m.setPaintProperty(id, 'fill-color', MAPCOL.land); m.setPaintProperty(id, 'fill-opacity', 0); }
        else if (id === 'landuse') { m.setPaintProperty(id, 'fill-color', ['match', ['get', 'class'], ['park', 'pitch', 'grass', 'cemetery', 'wood', 'scrub', 'golf_course', 'agriculture'], MAPCOL.park, 'rgba(234,224,206,0)']); m.setPaintProperty(id, 'fill-opacity', .85); }
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
      m.addLayer({ id: 'comuna-dots', type: 'circle', source: 'comuna-dots', paint: { 'circle-radius': 5.5, 'circle-color': ['get', 'c'], 'circle-stroke-width': 1.3, 'circle-stroke-color': INK, 'circle-opacity': .9 } });
    } catch (e) {}
    sketchMapbox(m);
  }

  // ---------- the hand-drawn map (app sketchMapbox, without the trees and hills the app keeps switched off) ----------
  // Roads drawn as ink outlines, watercolor water and parks with an inked edge, hand-lettered neighborhood names.
  const HAND_READY = document.fonts ? document.fonts.load(`20px ${HAND_FONT}`).catch(() => {}) : Promise.resolve();
  const canvasImage = (c, w, h) => ({ width: w, height: h, data: new Uint8Array(c.getContext('2d').getImageData(0, 0, w, h).data.buffer) });
  // watercolor mottle: soft blotches of a darker and a lighter tone at every wrap offset (seamless), then fine granulation
  function washTile(g, s, R, dark, light, n = 26) {
    for (let i = 0; i < n; i++) { const x = R() * s, y = R() * s, r = s * (.12 + R() * .24), col = R() < .55 ? dark : light, a = .035 + R() * .06;
      [-s, 0, s].forEach(ox => [-s, 0, s].forEach(oy => { const gr = g.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, r);
        gr.addColorStop(0, `rgba(${col},${a})`); gr.addColorStop(.6, `rgba(${col},${a * .55})`); gr.addColorStop(1, `rgba(${col},0)`); g.fillStyle = gr; g.fillRect(x + ox - r, y + oy - r, r * 2, r * 2); })); }
    for (let i = 0; i < s * s / 30; i++) { g.fillStyle = `rgba(${dark},${.03 + R() * .04})`; g.fillRect(R() * s, R() * s, .7, .7); }
  }
  function washImage(base, dark, light, seed, grass) {
    const s = 256, k = 2, c = document.createElement('canvas'); c.width = c.height = s * k; const g = c.getContext('2d'); g.scale(k, k); const R = rng(seed);
    g.fillStyle = base; g.fillRect(0, 0, s, s); washTile(g, s, R, dark, light, 30);
    if (grass) { // stipple and a few grass tufts
      g.fillStyle = 'rgba(53,58,50,.28)'; for (let i = 0; i < 150; i++) { g.beginPath(); g.arc(R() * s, R() * s, .45, 0, 7); g.fill(); }
      g.strokeStyle = 'rgba(53,58,50,.22)'; g.lineWidth = .6; for (let i = 0; i < 25; i++) { const x = R() * s, y = R() * s; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 1.5, y - 2.5); g.moveTo(x + 3, y); g.lineTo(x + 3.6, y - 2.8); g.stroke(); }
    }
    return canvasImage(c, s * k, s * k);
  }
  // a neighborhood name lettered by hand: each letter nudged and tilted a little, with a paper halo so it reads over roads
  function handLabel(text) {
    const k = 2, fs = 19 * k, pad = 6 * k, R = rng([...text].reduce((a, ch) => a * 31 + ch.charCodeAt(0) >>> 0, 7) % 2147483646 + 1);
    const c = document.createElement('canvas'), g = c.getContext('2d'); g.font = `${fs}px ${HAND_FONT}`;
    const sp = 2 * k, ws = [...text].map(ch => g.measureText(ch).width), w = Math.ceil(ws.reduce((a, b) => a + b + sp, 0) + pad * 2), h = Math.ceil(fs * 1.3 + pad * 2);
    c.width = w; c.height = h; g.font = `${fs}px ${HAND_FONT}`; g.textBaseline = 'middle'; g.lineJoin = 'round';
    const jit = [...text].map(() => [(R() - .5) * 1.6 * k, (R() - .5) * .09]);
    const draw = stroke => { let x = pad; [...text].forEach((ch, i) => { g.save(); g.translate(x + ws[i] / 2, h / 2 + jit[i][0]); g.rotate(jit[i][1]);
      stroke ? g.strokeText(ch, -ws[i] / 2, 0) : g.fillText(ch, -ws[i] / 2, 0); g.restore(); x += ws[i] + sp; }); };
    g.strokeStyle = 'rgba(242,234,218,.92)'; g.lineWidth = 5 * k; draw(true);
    g.fillStyle = INK; g.globalAlpha = .88; draw(false); g.strokeStyle = INK; g.lineWidth = .55 * k; draw(true);
    return canvasImage(c, w, h);
  }
  function sketchMapbox(m) {
    const L = m.getStyle().layers || [], set = (id, k, v) => { try { m.setPaintProperty(id, k, v); } catch (e) {} };
    L.forEach(l => { const id = l.id;
      if (l.type === 'background') set(id, 'background-color', SK.land);
      else if (l.type === 'fill' && /water/.test(id)) set(id, 'fill-color', SK.water);
      else if (l.type === 'fill' && /building/.test(id)) { set(id, 'fill-color', SK.land); set(id, 'fill-outline-color', 'rgba(53,58,50,.28)'); }
      else if (l.type === 'line' && /^(road|bridge|tunnel)/.test(id) && !/path|steps|pedestrian|rail|construction/.test(id)) {
        if (/case/.test(id)) { set(id, 'line-color', INK); set(id, 'line-opacity', /motorway|trunk|primary/.test(id) ? .62 : .5); }
        else set(id, 'line-color', /motorway|trunk|primary/.test(id) ? SK.major : SK.road);
      }
      else if (l.type === 'line' && /path|pedestrian|steps/.test(id)) set(id, 'line-color', 'rgba(250,246,238,.75)');
      else if (l.type === 'symbol' && /road/.test(id)) { set(id, 'text-color', '#5E6157'); set(id, 'text-halo-color', SK.land); }
    });
    // the style draws each road as one line, so add the pen outline: two thin ink lines with a gap as wide as the road
    ['road-simple', 'bridge-simple'].forEach(rid => { const r = L.find(l => l.id === rid); if (!r) return; try {
      m.addLayer({ id: 'sk-ink-' + rid, type: 'line', source: r.source, 'source-layer': r['source-layer'], filter: r.filter, minzoom: Math.max(r.minzoom || 0, 10), layout: { 'line-cap': 'butt', 'line-join': 'round' },
        paint: { 'line-color': INK, 'line-gap-width': r.paint['line-width'], 'line-width': ['interpolate', ['linear'], ['zoom'], 11, .5, 14, .9, 17, 1.3], 'line-opacity': ['interpolate', ['linear'], ['zoom'], 10, .12, 12.5, ['match', ['get', 'class'], ['motorway', 'trunk', 'primary', 'secondary'], .3, .06], 14, ['match', ['get', 'class'], ['motorway', 'trunk', 'primary', 'secondary'], .45, .2], 15.5, .58, 17, .62] } }, rid);
    } catch (e) {} });
    const ids = L.map(l => l.id), firstWater = ids.find(id => /^water/.test(id)), afterWater = ids[ids.lastIndexOf('water') + 1];
    try {
      if (!m.hasImage('sk-water')) m.addImage('sk-water', washImage(SK.water, '126,160,174', '226,236,236', 23), { pixelRatio: 2 });
      if (!m.hasImage('sk-park')) m.addImage('sk-park', washImage(SK.park, '150,170,122', '226,232,206', 11, true), { pixelRatio: 2 });
      m.setPaintProperty('water', 'fill-pattern', 'sk-water');
      m.addLayer({ id: 'sk-parks', type: 'fill', source: 'composite', 'source-layer': 'landuse', filter: ['match', ['get', 'class'], ['park', 'wood', 'scrub', 'grass', 'cemetery', 'golf_course', 'pitch'], true, false], paint: { 'fill-pattern': 'sk-park' } }, firstWater);
      m.addLayer({ id: 'sk-parks-edge', type: 'line', source: 'composite', 'source-layer': 'landuse', filter: ['match', ['get', 'class'], ['park', 'cemetery', 'golf_course'], true, false], minzoom: 11, paint: { 'line-color': SK.parkInk, 'line-width': ['interpolate', ['linear'], ['zoom'], 11, .5, 15, 1.1], 'line-opacity': .32 } }, firstWater);
      m.addLayer({ id: 'sk-shore', type: 'line', source: 'composite', 'source-layer': 'water', paint: { 'line-color': SK.waterInk, 'line-width': ['interpolate', ['linear'], ['zoom'], 10, .6, 15, 1.6] } }, afterWater);
    } catch (e) {}
    // neighborhood names as hand-lettered images (Mapbox can't use web fonts); Mapbox still places them and avoids collisions
    HAND_READY.then(() => { if (!m.style) return; try {
      HOODS.forEach(h => { const id = 'hand:' + h.name.toUpperCase(); if (!m.hasImage(id)) m.addImage(id, handLabel(h.name.toUpperCase()), { pixelRatio: 2 }); });
      if (m.getLayer('comuna-hood-labels')) m.setLayoutProperty('comuna-hood-labels', 'visibility', 'none');
      m.addLayer({ id: 'sk-hood-labels', type: 'symbol', source: 'comuna-hoods', minzoom: 11, layout: { 'icon-image': ['concat', 'hand:', ['get', 'name']], 'icon-size': ['interpolate', ['linear'], ['zoom'], 11, .8, 15, 1.05], 'icon-offset': [0, -26], 'icon-padding': 4 } });
    } catch (e) {} });
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
        // Back to the paper map. On the website this is fine at any point (the pins are examples), so a token
        // refused before or after load never leaves an empty box.
        const giveUp = () => { if (!el.isConnected) return; done = true; try { m.remove(); } catch (e) {} el.remove(); wrap.classList.remove('live'); paintPaper(wrap); };
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
            const mk = document.createElement('div'); mk.className = 'pinmk'; mk.innerHTML = pinHtml(p, i, wrap.dataset.sel === String(i));
            new mapboxgl.Marker({ element: mk }).setLngLat([p.lng, p.lat]).addTo(m);
          });
          const reveal = () => { if (!el.isConnected) return; if (m.isStyleLoaded() && el.clientHeight > 0) wrap.classList.add('live'); else giveUp(); };
          if (m.areTilesLoaded && m.areTilesLoaded()) reveal(); else m.once('idle', reveal);
          wrap.addEventListener('click', e => { const card = e.target.closest('.picks .pick'); if (card) { const p = PICKS[card.dataset.i]; m.easeTo({ center: [p.lng, p.lat], duration: 600 }); } });
          const tg = wrap.querySelector('.toggle button[data-mode="map"]'); if (tg) tg.addEventListener('click', () => setTimeout(() => m.resize(), 0));
        });
      }).catch(() => {});
    }
  }

  document.querySelectorAll('.mapwrap').forEach(wrap => {
    const tag = (pin, on) => { const t = pin.querySelector('.tag');
      if (on && !t) { pin.insertAdjacentHTML('beforeend', `<span class="tag">${escH(PICKS[pin.dataset.i].venue)}</span>`); fitTag(pin); }
      else if (!on && t) t.remove(); };
    const select = i => {
      wrap.dataset.sel = i;
      wrap.querySelectorAll('.pin').forEach(p => { const on = p.dataset.i === String(i); p.classList.toggle('sel', on); tag(p, on); });
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
    // pointing at a pin shows its name tag, like the app's map
    wrap.addEventListener('mouseover', e => { const p = e.target.closest('.pin'); if (p && !wrap.classList.contains('list')) { tag(p, true); p.parentElement.style.zIndex = 30; } });
    wrap.addEventListener('mouseout', e => { const p = e.target.closest('.pin'); if (p && !p.contains(e.relatedTarget)) { if (!p.classList.contains('sel')) tag(p, false); p.parentElement.style.zIndex = ''; } });
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
