 # CTRL-T
 
A custom new tab page. Brutalist look: raw blocks, hard edges, stamped labels.
 
Built for Hack Club Stardance.
 
## What it does
 
- Big central clock, the dominant thing on the page
- Search bar that sends you straight to Google
- Editable quick-link dock, saved locally in your browser
- Background switcher with three modes:
  - `BLOCK` — flat colour, no image, always works
  - `APOD` — NASA's Astronomy Picture of the Day, cached so it only fetches once a day
  - `NASA.LIB` — a random image from the NASA Image and Video Library, pulled from a rotating set of space-themed searches
- Every photo background gets forced through greyscale and high contrast so it doesn't clash with the rest of the page. The grid lines sit on top of the image rather than around it.

## Stack
 
Plain HTML, CSS, and JavaScript.
 
## Setup
 
1. Clone the repo
2. Get a free NASA API key from [api.nasa.gov](https://api.nasa.gov) (its free and instant)
3. Paste your key into `NASA_API_KEY` near the top of `script.js`
4. Open `index.html` in a browser. That's it

 
Live URL: [ctrl-t.vercel.app](https://ctrl-t.vercel.app)
 
## Why brutalist
 
The rest of my Stardance projects (Pulsar, G-Lens, Umbra, GRID, AstroLab) share a softer dark-space look. This one is deliberately different. I wanted something that felt raw and functional rather than pretty, closer to a control panel than a nicely designed site. It also made the whole build faster since there's no time spent tuning gradients or easing curves.
