# Aniruddha Adak — Personal AI Agency (multi-page static site)

A handcrafted, framework-free, multi-page portfolio + agency site. Pure HTML/CSS/JS.
Deploy anywhere static files run: Vercel, Netlify, GitHub Pages, Cloudflare Pages.

## Pages / routes

| File | Route | Purpose |
|---|---|---|
| index.html | / | Hero, services, stats, featured projects, FAQ (with FAQPage schema) |
| about.html | /about.html | Timeline 2014→2026, verified certifications |
| projects.html | /projects.html | Filterable archive of 18 projects with live/repo links |
| agency.html | /agency.html | Services, engagement process, personal superintelligence manifesto |
| future.html | /future.html | Optimism vs pessimism predictions with probability tags |
| writing.html | /writing.html | Selected DEV articles |
| contact.html | /contact.html | Verified contact directory (all platforms) |

## SEO + GEO features

- Unique title/description/canonical per page, Open Graph + Twitter cards
- JSON-LD: Person, WebSite, FAQPage
- sitemap.xml + robots.txt
- llms.txt with machine-readable verified facts + namesake disambiguation
- Semantic HTML, descriptive anchors, fast static load, mobile responsive

## Before you publish

1. Search-and-replace `https://aniruddha-agency.vercel.app` with your final domain (appears in every page head + sitemap.xml + llms.txt).
2. Replace `og-cover.png` if you want a different social preview (1200x630 recommended).
3. Deploy, then submit the sitemap in Google Search Console and Bing Webmaster Tools.
4. Link the new site from your GitHub bio, Linktree, X and LinkedIn so crawlers cross-confirm identity.

## Run locally

```
cd aniruddha-agency
python -m http.server 8080
# or: npx serve .
```

Then open http://localhost:8080

## Design system

Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (code), Playfair Display italic (manifesto).
Palette: deep space navy base with cyan → violet → magenta gradients; lime/red reserved for optimism/pessimism tags.
Motion: canvas particle constellation, aurora blobs, scroll reveals, 3D card tilt, typewriter roles, animated counters, marquee. All respect `prefers-reduced-motion`.

## Honesty policy

All numbers (354+ merged PRs, 145+ repos, 350+ articles, 12 hackathons) are the API-verified versions from the August 2026 footprint audit. Inflated template claims (10K stars, fake degrees) were deliberately excluded.
