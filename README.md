# TrueDose

A medicine authenticity checker and pharmacy finder for Nigeria, with a live 3D DNA helix background.

TrueDose guides people through checking a medicine against NAFDAC's official Greenbook, helps them find pharmacies, and makes it easy to report suspected fakes.

> **Important:** TrueDose is an information tool. It is not a lab test, it is not affiliated with NAFDAC, and it does not give medical advice. The pharmacy listings in this version are **sample data**.

---

## Features

| Page | What it does |
|------|--------------|
| **Home** | Headline, shortcuts, and a three-step "How it works" |
| **Check** | Six-point pack checklist with a clear verdict (consistent / be careful / do not use), plus a link to the NAFDAC Greenbook |
| **Pharmacies** | Search by Lagos area and medicine, cheapest first |
| **Report** | Saves a report on the user's device and links to NAFDAC's official report page |
| **Learn** | Expandable guides: spotting fakes, scratch-code check, buying safely, storing medicines, what to do after taking a suspect medicine |
| **About** | What the site does and does not do, and a note for pharmacies |

Other details:
- Sidebar navigation on desktop; a slide-in menu on phones.
- Live Three.js DNA helix that follows the pointer and rotates on scroll. It holds still for users with reduced motion turned on, and the page still works if WebGL is unavailable.
- Light and dark mode follow the user's system setting.

---

## Project structure

```
truedose/
├── index.html          All six pages (switched with URL hashes)
├── css/
│   └── style.css       Styles, light/dark colour tokens, sidebar
├── js/
│   ├── app.js          Routing, sidebar menu, checklist, pharmacy search, reports
│   └── helix.js        Three.js live DNA helix
├── assets/
│   └── dna-bg.jpg      Background image (blurred behind the 3D scene)
├── vendor/
│   └── three.min.js    Three.js r128 (local copy)
└── README.md
```

---

## Run it locally

No build step or dependencies.

**Option 1:** open `index.html` in a browser.

**Option 2:** serve the folder (recommended):

```bash
cd truedose
python3 -m http.server 8000
# open http://localhost:8000
```

An internet connection is only needed for the Google Fonts (Bricolage Grotesque and Figtree). Without it, the site falls back to system fonts.

---

## How the pages work

Pages are sections in `index.html` with ids like `pg-check`. The router in `js/app.js` reads the URL hash (`#home`, `#check`, `#pharmacies`, `#report`, `#learn`, `#about`) and shows the matching section. Links are plain anchors such as `<a href="#check">`.

### Add a new page
1. Add a section to `index.html`: `<section class="page" id="pg-faq" hidden>...</section>`
2. Add the name to the `PAGES` array in `js/app.js`.
3. Add a link in the sidebar: `<a href="#faq">FAQ</a>`

---

## Customise

### Replace the sample pharmacies
In `js/app.js`, edit the `P` array:

```js
{ n: 'Pharmacy name', a: 'Ikeja', h: '8am–10pm',
  i: { 'Paracetamol 500mg (16 tablets)': 350, 'ORS sachet': 250 } }
```

- `n` is the name, `a` the area, `h` the opening hours, `i` the medicines with prices in naira.
- To add an area, also add it to the `<select id="area">` in `index.html`.
- Only list pharmacies whose licence you have verified, and remove the "sample" tag in `drawP()` when the data is real.

### Change colours
Colours are CSS variables at the top of `css/style.css`. There is one set for light mode, one for dark mode under `prefers-color-scheme`, and one under `[data-theme="dark"]`. Change `--accent` to restyle buttons, links and the active menu item.

### Tune the 3D helix (`js/helix.js`)
- `N`: number of steps in the helix
- `Rd`: helix radius
- `dy`: vertical spacing
- `tw`: twist per step
- `pal()`: colours for light and dark mode
- Bubbles: change the loop count (14) for more or fewer floating molecules

### Change the background image
Replace `assets/dna-bg.jpg` with another image of any size. Keep the filename, or update the path in `css/style.css`.

---

## Data and privacy

- Reports are stored in the browser's `localStorage` on the user's own device. Nothing is sent to a server.
- The Check page does not look anything up automatically. It sends users to NAFDAC's Greenbook (https://greenbook.nafdac.gov.ng) and helps them compare what they find with the pack.
- A matching registration number alone does not prove a pack is genuine, because counterfeiters copy real numbers. The site says this on purpose.
- If you add accounts or shared reports, comply with the Nigeria Data Protection Act 2023.

---

## Deploy

It is a static site. Upload the folder as-is to Netlify, Vercel, GitHub Pages, Cloudflare Pages or any static host.

---

## Roadmap

1. Backend (FastAPI or Supabase) for shared, moderated reports
2. Verified pharmacy sign-up with licence checks
3. Report moderation and abuse protection
4. Helix reacts to the Check result (calm blue for consistent, red for fail)
5. Yoruba, Hausa, Igbo and Pidgin versions of the Learn pages

---

## Known limitations

- Pharmacy listings and prices are sample data.
- Reports are local to one device.
- The checklist is guidance, not a verification of the product.
- 3D rendering needs WebGL; without it, only the blurred background image shows.

---

## Credits and disclaimer

- Three.js (r128) for the 3D scene
- Google Fonts: Bricolage Grotesque and Figtree
- Registration data and the official report channel belong to NAFDAC. TrueDose is independent and not endorsed by NAFDAC.
- If you feel unwell after taking a medicine, see a doctor or pharmacist.
