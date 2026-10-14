// Comuna website
(() => {
  // Supabase (same project as the app). The publishable key is safe in the page;
  // the site_messages table only accepts inserts (see supabase/site_messages.sql).
  const SUPABASE_URL = 'https://sjxxiammvvfxcnukkqhg.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_sachUJlp8KvvBgCdg1fPGQ_cPmzOLzm';

  const header = document.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  document.querySelectorAll('form[data-form]').forEach(form => {
    const status = form.querySelector('.form-status');
    const button = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      if (data.website) return; // honeypot: bots fill the hidden field
      delete data.website;
      const missing = [...form.querySelectorAll('[required]')].find(f => !f.value.trim());
      if (missing) { status.textContent = 'Please fill in the required fields.'; missing.focus(); return; }
      const email = form.querySelector('[type="email"]');
      if (email && !email.checkValidity()) { status.textContent = 'That email doesn\'t look quite right.'; email.focus(); return; }

      button.disabled = true;
      status.textContent = 'Sending…';
      try {
        const { name, email: mail, message, ...details } = data;
        const res = await fetch(`${SUPABASE_URL}/rest/v1/site_messages`, {
          method: 'POST',
          headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
          body: JSON.stringify({ kind: form.dataset.form, name, email: mail, message: message || null, details, page: location.pathname })
        });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        status.textContent = form.dataset.form === 'host'
          ? 'Got it! We\'ll be in touch within a few days.'
          : 'Thanks! Your message is on its way to us.';
      } catch {
        status.textContent = 'That didn\'t send. Please try again, or DM us on Instagram @comuna.events.';
      } finally {
        button.disabled = false;
      }
    });
  });
})();
