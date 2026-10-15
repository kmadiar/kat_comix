# Strips&Meer

School newspaper website: weekly articles and comics. Built with Jekyll, which GitHub Pages builds automatically — no build tools needed on your computer

## Put it online (once)

1. Create a GitHub repository named `kat_comix` and push this folder to it.
2. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
3. After a minute the site is live at `https://<your-username>.github.io/kat_comix/`.

If the repository has a different name, change `baseurl` in `_config.yml` to `"/<repo-name>"`. For a custom domain or a `<username>.github.io` repository, set `baseurl: ""`.

Also fill in `school` and (optionally) `insturen_link` in `_config.yml`.

## Weekly routine

Each week = one **editie** number. Everything with the same number appears together on the home page.

### Add an article

Create `_posts/YYYY-MM-DD-short-title.md`:

```markdown
---
title: "Headline"
editie: 2
rubriek: Sport            # Schoolnieuws, Interview, Sport, Wetenschap, Creatief, Opinie (see _data/rubrieken.yml)
intro: "One or two sentences shown on cards and under the headline."
author: "Name"
klas: "2B"
featured: true            # optional: the main article of the edition
image: /assets/img/2026-10-16-photo.jpg   # optional
image_caption: "Caption · Foto: Name"     # optional
strip: kat-en-co-01  # optional: show a related comic next to the article
---
Article text in Markdown.

## Subheading

> „A quote”
>
> — Name, role
```

Posts dated in the future are not published until that date.

### Add a comic episode

1. Put the images in `assets/comics/<series-id>/` (JPG, PNG or SVG; one image per panel, or one per page).
2. Create `_comics/<series-id>-02.md`:

```markdown
---
title: "Episode title"
series: kat-en-co
episode: 2
cover: /assets/comics/kat-en-co/02-cover.jpg   # optional: episode cover on the home page (else the series cover, else the first panel)
date: 2026-10-16
teaser: "One line, used as the page description for search engines and link previews."
panels:
  - image: /assets/comics/kat-en-co/02-1.jpg
    alt: "Short description of what happens in the panel"
    wide: true            # optional: full width in page view
  - image: /assets/comics/kat-en-co/02-2.jpg
    alt: "…"
---
Optional note from the maker.
```

The newest comic (by `date`) automatically becomes **Strip van de dag** on the home page.

### Add a new series

Add an entry to `_data/series.yml` (id, name, genre, description, author, klas, tint, optional cover).

## Preview locally (optional)

```sh
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000/kat_comix/

## Structure

| Path | What |
|---|---|
| `_config.yml` | Site name, school, base URL |
| `_posts/` | Articles |
| `_comics/` | Comic episodes |
| `_data/series.yml` | Comic series |
| `_data/rubrieken.yml` | Article categories and colors |
| `_layouts/`, `_includes/` | Page templates |
| `assets/css/site.css` | Design system (colors, type, components) |
| `assets/js/site.js` | Genre filter and comic reading mode |

The sample welcome post is a placeholder — replace or delete it.
