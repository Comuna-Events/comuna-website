# Comuna website

The website for Comuna (wearecomuna.com), designed to look and feel like the Comuna app.
It's a plain static site: no framework, hosted for free on GitHub Pages.

## Pages

| Page | File | Notes |
|---|---|---|
| Home | `src/pages/index.html` | Hero with the "top 4" picks, the four kinds of plans, passport, hosts teaser, contact form |
| About | `src/pages/about.html` | Story and how Comuna works |
| Explore | `src/pages/explore.html` | The live app demo, embedded in a phone frame |
| For Hosts | `src/pages/for-hosts.html` | How hosting works and the host application form |
| Support | `src/pages/support.html` | FAQ and support form (App Store requires a Support URL) |
| Privacy Policy | `src/pages/privacy.html` | **Draft**: needs legal review (App Store requires a Privacy Policy URL) |
| Terms of Use | `src/pages/terms.html` | **Draft**: needs legal review |
| 404 | `src/pages/404.html` | Shown for missing pages |

## Editing

1. Edit the page in `src/pages/`, or the shared header and footer in `src/layout.html`.
2. Run `python3 build.py`. It writes the finished pages (`index.html`, `about.html`, ...) to the repo root.
3. Commit and push. GitHub Pages publishes within a minute or two.

Styles live in `assets/site.css` and use the app's design tokens (colors, Big Shoulders Display, DM Sans and Caveat).
The demo link is set once in `build.py` (`demo_url`).

## Forms

The contact, host and support forms save to a `site_messages` table in the app's Supabase project.
Run `supabase/site_messages.sql` once in the Supabase SQL editor to create it. Visitors can only add rows;
read submissions in Supabase under Table Editor → `site_messages`.

## Before the App Store launch

- [ ] Have the Privacy Policy and Terms reviewed, fill in the `[bracketed]` details, and remove the draft notices.
- [ ] Add a real support email on the Support, Privacy and Terms pages.
- [ ] Add the App Store ID to the `apple-itunes-app` meta tag in `src/layout.html` (shows Safari's "Open in app" banner).
- [ ] For links that open the app (Universal Links), add `.well-known/apple-app-site-association` with the app's Team ID and bundle ID.
- [ ] Add App Store / "Download" buttons where it says "Try the demo".

## Pointing wearecomuna.com here

When you're ready to switch from Squarespace: add a `CNAME` file containing `www.wearecomuna.com`,
set the custom domain under Settings → Pages, then update the domain's DNS records
(`www` CNAME to `<github-user>.github.io`, plus GitHub's four A records for the bare domain).
Leave any email (MX) records untouched.
