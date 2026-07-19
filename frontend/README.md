# LumiFrame Studio — Premium Photography Studio Website

A cinematic, dark-luxury photography studio demo site built with React, Vite, Tailwind CSS, and Framer Motion.

## Getting Started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## Stack
- React 18 + Vite
- Tailwind CSS (custom gold/black luxury theme)
- Framer Motion (scroll reveals, parallax, page transitions, animated counters)
- React Icons

## Structure
```
src/
  components/   All UI sections & reusable pieces (Hero, Portfolio, About, Services, ...)
  data/         content.js — all copy + Unsplash image URLs in one place
  App.jsx       Composes every section
  index.css     Tailwind layers + shared utility classes (.btn-primary, .section-heading, ...)
```

## Notes
- All photography is sourced from Unsplash (royalty-free) via direct image URLs — swap any URL in `src/data/content.js` to use your own photos.
- Brand name "LumiFrame Studio" and all copy are placeholder content for demo purposes.
- Colors, fonts and spacing tokens live in `tailwind.config.js` for easy re-theming.
