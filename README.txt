CHAMPIONS FOR MENTAL HEALTH — MULTI-PAGE WEBSITE TEMPLATE

Open index.html to view the homepage. No build step is needed (HTML, CSS, vanilla JavaScript).

FILES
- index.html ........ Home
- about.html ........ About, mission, team, gallery, empowerment
- programmes.html ... Programmes and services
- research.html ..... Research and publications
- team.html ......... Leadership team
- news.html ......... News and resources
- donate.html ....... Donations
- volunteer.html .... Volunteer form
- contact.html ...... Contact and enquiry form
- login.html / register.html ... Member account screens
- styles.css ........ All styles (see "How the CSS is organised")
- script.js ......... Mobile menu, demo forms, footer year, Programmes slider
- images/ ........... Photographs used by the hero, About hero, Who We Are and the slider

HOW THE CSS IS ORGANISED (styles.css)
1. Design tokens at the top (colours, sizes). Change the colours of the whole site there.
2. Shared classes (container, section, buttons, cards, forms) used on many pages.
3. One block per section. Every section has its own class, for example:
   hero, who-we-are, features, services, trust, programmes, team-preview,
   news-preview, contact-preview. Edit that block and only that section changes.
4. Each section's responsive rules sit directly under it.
5. Inner pages: every page banner has .page-hero plus its own class (about-hero,
   programmes-hero, ...). Every inner-page section also has its own class; the list
   is at the end of styles.css.

PROGRAMMES SLIDER (homepage)
- Four slides (.programme-slide) slide sideways automatically every 4 seconds.
- Change the speed: SLIDE_DELAY in script.js (milliseconds).
- Change a slide's photo: its own class in styles.css (programme-slide-month, -signs, -lived, -help).
- Change the text: edit the slide in index.html.
- Pauses on hover or focus, has dots and swipe, and does not auto-play for visitors
  who have "reduce motion" turned on.

BEFORE LAUNCH (these need a backend or third-party service)
1. Replace placeholder photographs and the team placeholders with approved images.
2. Replace placeholder contact details and team names with client-approved content.
3. Connect the contact and volunteer forms to a secure form handler.
4. Connect donations to an approved payment provider.
5. Implement secure authentication before enabling login and registration.
6. Add a newsletter service, a way to publish news (CMS), and WhatsApp contact if required.
7. Confirm privacy policy, data handling, domain, hosting, backups and SSL.
