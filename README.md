# Comuna website

The website for Comuna (wearecomuna.com), designed to look and feel like the Comuna app.
It's a plain static site: no framework, hosted for free on GitHub Pages.

## Pages

Every page is built from the app's own screens and components, so the site feels like the app.

| Page | File | Based on the app's… |
|---|---|---|
| Home | `src/pages/index.html` | Onboarding, map (paper map with pins and cards), Top 4, interests, Plans calendar, Passport cover, host portal |
| Passport | `src/pages/passport.html` | Passport screen: cover, stamp pages, patches, points, leaderboard |
| For Hosts | `src/pages/for-hosts.html` | Host portal (dark screen) plus an application form |
| About | `src/pages/about.html` | Profile screen |
| Try the app | `src/pages/explore.html` | The app's desktop stage, with the live app in a phone frame |
| Support | `src/pages/support.html` | Alerts list (FAQ) and the Beta · Feedback sheet (App Store needs a Support URL) |
| Privacy Policy | `src/pages/privacy.html` | Bottom sheet (App Store needs a Privacy Policy URL). Not yet reviewed by a lawyer |
| Terms of Use | `src/pages/terms.html` | Bottom sheet. **Draft**: needs legal review |
| 404 | `src/pages/404.html` | Stamp modal |

The map, pins, pick cards and calendar are drawn by `assets/site.js`, ported from the app. The events on the
website map are examples; edit `PICKS` in `assets/site.js` to change them.

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

- [x] Privacy Policy: details filled in (run by Corrie Pickering as an individual; corrie@wearecomuna.com).
- [ ] Have the Privacy Policy and Terms reviewed by a lawyer, and update both when the LLC is formed.
- [ ] Terms: fill in the `[bracketed]` details and remove the draft notice.
- [ ] Add a support email on the Support and Terms pages.
- [ ] Add the App Store ID to the `apple-itunes-app` meta tag in `src/layout.html` (shows Safari's "Open in app" banner).
- [ ] For links that open the app (Universal Links), add `.well-known/apple-app-site-association` with the app's Team ID and bundle ID.
- [ ] Add App Store / "Download" buttons where it says "Try the demo".

## Pointing wearecomuna.com here

When you're ready to switch from Squarespace: add a `CNAME` file containing `www.wearecomuna.com`,
set the custom domain under Settings → Pages, then update the domain's DNS records
(`www` CNAME to `<github-user>.github.io`, plus GitHub's four A records for the bare domain).
Leave any email (MX) records untouched.
