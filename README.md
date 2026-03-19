
[README.md](https://github.com/user-attachments/files/26128733/README.md)
# Hackwarts — Where Magic Meets Code

> A Harry Potter-themed hackathon landing page for **GFG Campus Body — RKGIT, Ghaziabad**.  
> Built with plain **HTML, CSS, and vanilla JavaScript** — no frameworks, no build tools needed.

---

## 🌐 Live Preview
[potter-theme-landing.preview.emergentagent.com](https://potter-theme-landing.preview.emergentagent.com/)

---

## 📁 File Structure

```
hackwarts/
├── index.html   ← Full page structure with all sections + Contact Us
├── style.css    ← All visual styles (14 commented sections)
├── script.js    ← All interactions (cursor, scroll, sound, navbar)
└── README.md    ← This file
```

---

## 🚀 How to Run Locally

### Option 1 — Double-click (simplest)
Just double-click `index.html` — it opens directly in your browser. No server needed.

### Option 2 — VS Code Live Server (recommended)
1. Install [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
2. Right-click `index.html` → **Open with Live Server**
3. Changes auto-reload the browser

### Option 3 — Python server
```bash
cd hackwarts
python3 -m http.server 8080
# Open http://localhost:8080
```

---

## ✏️ How to Make Changes

### Change the social media links
Open `index.html` and find the Contact Us section (search for `id="contact-us"`).  
Each card has an `<a href="...">` — just replace the URL:

```html
<!-- WhatsApp — change the href below -->
<a href="https://chat.whatsapp.com/YOUR_LINK_HERE" class="social-card whatsapp" ...>

<!-- LinkedIn — change the href below -->
<a href="https://www.linkedin.com/company/YOUR_PAGE" class="social-card linkedin" ...>

<!-- Instagram — change the href below -->
<a href="https://www.instagram.com/YOUR_HANDLE" class="social-card instagram" ...>
```

### Change the registration link
Search for the Unstop URL in `index.html` — there are **3 occurrences**  
(navbar button, hero CTA, and contact card). Replace all three with your link.

### Change the color scheme
All colors are CSS variables at the top of `style.css`:
```css
:root {
  --clr-bg:    #06050e;  /* page background */
  --clr-gold:  #d4af37;  /* primary accent  */
  /* ... */
}
```

### Change card hover glow colors (Contact Us section)
In `index.html`, find the `<style>` block in `<head>` and edit:
```css
.social-card.whatsapp:hover  { box-shadow: 0 20px 40px rgba(37, 211, 102, 0.15); }
.social-card.linkedin:hover  { box-shadow: 0 20px 40px rgba(10, 102, 194, 0.15); }
.social-card.instagram:hover { box-shadow: 0 20px 40px rgba(228, 64, 95, 0.2);  }
```

### Change the card animation stagger timing
In `index.html`, find the `<script>` at the bottom and edit:
```js
const delays = [100, 250, 400]; // milliseconds for card 1, 2, 3
```

### Add / remove sponsor cards
Find `<!-- Sponsor card grid -->` in `index.html` and copy-paste a sponsor card block.

### Change event date / location
Find `id="contact-us"` section in `index.html`:
```html
<span>RKGIT, Ghaziabad, UP</span>        <!-- venue -->
<span>Coming Soon — Stay Tuned!</span>   <!-- replace with real date -->
```

---

## 🎨 Features

| Feature | How it works |
|---|---|
| Custom golden cursor | `div#cursorGlow` follows mouse via `requestAnimationFrame` |
| Cursor expands on hover | `.expanded` CSS class added by JS |
| Twinkling star field | Pure CSS `background-image` dots + `@keyframes twinkle` |
| SVG castle silhouette | Inline SVG built from `<rect>` and `<polygon>` |
| Fog drift | Two `<div>` layers with `@keyframes fog-drift` |
| Navbar scroll effect | JS adds `.scrolled` at 60px → CSS transition |
| Scroll-reveal animations | `IntersectionObserver` adds `.visible` class |
| Hero staggered entrance | CSS `@keyframes reveal` with `animation-delay` |
| Contact Us social cards | Staggered float-up animation on viewport enter |
| Shimmer on hover | CSS `::before` pseudo-element sweeps across card |
| Platform-color glow | Each card glows with its brand color on hover |
| Floating sparkle dots | Pure CSS `@keyframes float-up` animation |
| Sound effects (whoosh) | Web Audio API — procedural filtered white noise |
| Sound effects (sparkle) | Web Audio API — ascending sine wave arpeggio |
| Background music | `<audio loop>` Harry Potter theme, toggled by gold button |
| Responsive layout | CSS Grid collapses at 1024px (tablet) and 768px (mobile) |

---

## 📤 Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "Initial commit: Hackwarts landing page"
git remote add origin https://github.com/YOUR_USERNAME/hackwarts.git
git push -u origin main
```

Then: **GitHub → Settings → Pages → Source: main branch → Save**  
Your site will be live at: `https://YOUR_USERNAME.github.io/hackwarts/`

---

## 👥 Social Links (Current)

| Platform | URL |
|---|---|
| WhatsApp | https://chat.whatsapp.com/IdII0P9DM5dApapNIwN27T |
| LinkedIn | https://www.linkedin.com/company/geeksforgeeks-campus-body-rkgit/ |
| Instagram | https://www.instagram.com/gfg_rkgit |

---

## 🏫 Credits
- **Organised by** — GeeksForGeeks Campus Body, RKGIT, Ghaziabad
- **Fonts** — Google Fonts: Cinzel Decorative, Cinzel, Raleway
- **Sponsors** — GeeksForGeeks, Unstop
