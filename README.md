# Marek Vranka — academic website

A single-page academic site (research profile, filterable publications, vita, contact),
modeled on the layout of Eugen Dimant's site. Pure static HTML/CSS/JS — no build step.

## How to publish it on GitHub Pages (free, ~5 minutes)

1. Create a GitHub account (if you don't have one) at https://github.com.
2. Create a **new repository** named exactly:  `YOURUSERNAME.github.io`
   (replace YOURUSERNAME with your GitHub username — this exact name makes it a personal site).
   Keep it **Public**. Don't add a README (this folder already has one).
3. On the new repo page, click **"uploading an existing file"** and drag in
   `index.html`, `.nojekyll`, and `README.md` from this folder. Commit.
4. Go to the repo's **Settings → Pages**. Under "Build and deployment", set
   Source = "Deploy from a branch", Branch = `main` / root. Save.
5. Wait 1–2 minutes. Your site is live at:  `https://YOURUSERNAME.github.io`

### Or, using git from the command line
```bash
cd website-vranka
git init && git add -A && git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/YOURUSERNAME/YOURUSERNAME.github.io.git
git push -u origin main
```
Then enable Pages as in step 4 above.

## Editing
Everything lives in `index.html`. Publications are a JSON array near the bottom
(`const PUBS = [...]`); add an entry and it appears in the filters automatically.
To add a photo, replace the `<div class="avatar">MV</div>` block with
`<img class="avatar" src="photo.jpg" alt="Marek Vranka">` and drop `photo.jpg` in this folder.
