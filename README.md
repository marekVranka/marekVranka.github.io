# marekvranka.github.io

Personal academic website for Marek Vranka — a single static page, hosted free on GitHub Pages.

**Live:** https://marekvranka.github.io

## How it stays up to date

Citation counts, abstracts and open-access flags come from [OpenAlex](https://openalex.org).
A GitHub Action (`.github/workflows/update-citations.yml`) runs **on the 1st of every month**,
re-fetches the numbers, rebuilds `index.html`, and commits the result. You don't have to do anything.

You can also trigger it by hand: repo → **Actions** → *Update citations from OpenAlex* → **Run workflow**.

> GitHub pauses scheduled workflows after 60 days without repository activity and emails you.
> Click "Enable workflow" in the Actions tab to resume.

## Files

| Path | What it is |
|---|---|
| `index.html` | The built site. **Generated — don't edit by hand.** |
| `publications.json` | Source of truth: one entry per paper. Edit this to add a publication. |
| `meta.json` | When citations were last refreshed. Written by the fetch script. |
| `build.py` | Builds `index.html` from the data + template. |
| `template.html` | Page structure. |
| `style.css` | All styling. |
| `app.js` | Filtering, charts, co-author network, research DNA. |
| `fetch_openalex.py` | Pulls fresh citation data from OpenAlex. |
| `CV_Vranka.pdf` | Shown in the CV modal and offered for download. |

## Adding a publication

1. Add an entry to `publications.json`:

```json
{
 "y": 2027,
 "a": "Vranka, M., & Someone, A.",
 "t2": "Title of the paper",
 "j": "Journal Name",
 "t": ["moral"],
 "m": ["experiment"],
 "doi": "10.1234/example",
 "co": ["Someone"],
 "hl": 0
}
```
   `t` = topics, `m` = methods (keys are listed at the top of `build.py`),
   `co` = co-author surnames for the network, `hl` = 1 to flag a flagship venue.

2. Run `python build.py` — or just let the monthly Action do it.
   Citations fill in automatically once OpenAlex indexes the DOI.

## Editing text (bio, news, talks, CV entries)

All prose lives near the top of `build.py` as plain Python lists.
Change it there, run `python build.py`, commit.

## Running locally

```bash
python fetch_openalex.py   # optional: refresh citations
python build.py            # regenerate index.html
```
No dependencies beyond the Python standard library.
