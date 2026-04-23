# SEO Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a full SEO suite to chinaboxdr.com — meta tags, Open Graph, JSON-LD LocalBusiness schema, og:image, geo tags, and canonical URL.

**Architecture:** The site is a single `index.html` with two HTML documents: a thin outer loader shell and an inner HTML app embedded as a JS string inside the bundler. All SEO tags must go into the inner document's `<head>` (the string starting with `"<!DOCTYPE html>\n<html lang="es"><head>`). The og:image is exported from the brand PDF and saved as `/og-image.png`.

**Tech Stack:** Static HTML, Python for string manipulation, pdftoppm for logo extraction.

---

### Task 1: Export og:image from brand PDF

**Files:**
- Create: `og-image.png` (project root)

**Step 1: Extract logo page from PDF**

```bash
pdftoppm -r 300 -f 2 -l 2 "LOGO CHINA BOX DR + PAPELERIA.pdf" /tmp/chinabox_logo -png
```

Expected: `/tmp/chinabox_logo-2.png` (the clean logo on white background, page 2 of PDF)

**Step 2: Copy and resize to 1200×630 (OG standard)**

```bash
# Using sips (built-in macOS)
cp /tmp/chinabox_logo-2.png og-image.png
sips -z 630 1200 og-image.png
```

Expected: `og-image.png` exists in project root, ~1200×630px.

**Step 3: Commit**

```bash
git add og-image.png
git commit -m "add og:image from brand logo for social sharing"
```

---

### Task 2: Inject SEO meta tags into inner HTML head

**Files:**
- Modify: `index.html` (inner HTML string, head section)

**Step 1: Locate insertion point**

The inner head currently ends with the Google Fonts preconnect links. Find the exact string:

```
<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin=\"\">
```

All new tags go immediately after this line.

**Step 2: Insert meta tags**

Using Python, replace:
```
<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin=\"\">
```

With:
```
<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin=\"\">
<meta name=\"description\" content=\"Servicio de courier y carga desde China y Miami hacia Santo Domingo. Envíos marítimos y aéreos rápidos y seguros.\">
<meta name=\"keywords\" content=\"courier Santo Domingo, carga China República Dominicana, envíos Miami Santo Domingo, courier dominicano, China Box DR, logistics courier RD\">
<meta name=\"robots\" content=\"index, follow\">
<meta name=\"author\" content=\"China Box DR\">
<link rel=\"canonical\" href=\"https://chinaboxdr.com/\">
<meta property=\"og:type\" content=\"website\">
<meta property=\"og:url\" content=\"https://chinaboxdr.com/\">
<meta property=\"og:title\" content=\"China Box DR · Courier y Carga desde China y Miami a Santo Domingo\">
<meta property=\"og:description\" content=\"Servicio de courier y carga desde China y Miami hacia Santo Domingo. Envíos marítimos y aéreos rápidos y seguros.\">
<meta property=\"og:image\" content=\"https://chinaboxdr.com/og-image.png\">
<meta property=\"og:image:width\" content=\"1200\">
<meta property=\"og:image:height\" content=\"630\">
<meta property=\"og:locale\" content=\"es_DO\">
<meta property=\"og:site_name\" content=\"China Box DR\">
<meta name=\"twitter:card\" content=\"summary_large_image\">
<meta name=\"twitter:title\" content=\"China Box DR · Courier y Carga desde China y Miami a Santo Domingo\">
<meta name=\"twitter:description\" content=\"Servicio de courier y carga desde China y Miami hacia Santo Domingo. Envíos marítimos y aéreos rápidos y seguros.\">
<meta name=\"twitter:image\" content=\"https://chinaboxdr.com/og-image.png\">
<meta name=\"geo.region\" content=\"DO-DN\">
<meta name=\"geo.placename\" content=\"Santo Domingo, República Dominicana\">
<meta name=\"geo.position\" content=\"18.4861;-69.9312\">
<meta name=\"ICBM\" content=\"18.4861, -69.9312\">
```

Note: all `"` inside the JS string must be escaped as `\"`.

**Step 3: Update `<title>` tag**

Replace:
```
<title>ChinaBox DR · Próximamente<\/title>
```
With:
```
<title>China Box DR · Courier y Carga desde China y Miami a Santo Domingo<\/title>
```

**Step 4: Verify tags are in output**

```bash
python3 -c "
content = open('index.html').read()
checks = ['og:title', 'og:image', 'description', 'canonical', 'geo.region', 'twitter:card', 'json-ld']
for c in checks:
    print(c, '✓' if c in content else '✗ MISSING')
"
```

Expected: all show ✓ (json-ld will show ✗ until Task 3)

**Step 5: Commit**

```bash
git add index.html
git commit -m "add SEO meta tags: description, OG, Twitter Card, geo, canonical"
```

---

### Task 3: Add JSON-LD LocalBusiness structured data

**Files:**
- Modify: `index.html` (inner HTML string, just before `</head>`)

**Step 1: Locate insertion point**

Find the closing `</head>` tag in the inner HTML string. It appears as `<\/head>` or `/head>`.

**Step 2: Insert JSON-LD script before `</head>`**

Insert the following block immediately before `<\/head>`:

```json
<script type=\"application\/ld+json\">{\"@context\":\"https:\/\/schema.org\",\"@type\":\"LocalBusiness\",\"name\":\"China Box DR\",\"alternateName\":\"China Box Logistics Courier\",\"description\":\"Servicio de courier y carga desde China y Miami hacia Santo Domingo. Envíos marítimos y aéreos rápidos y seguros.\",\"url\":\"https:\/\/chinaboxdr.com\/\",\"logo\":\"https:\/\/chinaboxdr.com\/og-image.png\",\"image\":\"https:\/\/chinaboxdr.com\/og-image.png\",\"email\":\"contacto@chinaboxdr.com\",\"address\":{\"@type\":\"PostalAddress\",\"streetAddress\":\"Calle 15\",\"addressLocality\":\"Santo Domingo\",\"addressCountry\":\"DO\"},\"areaServed\":[{\"@type\":\"Country\",\"name\":\"República Dominicana\"}],\"serviceType\":[\"Courier aéreo\",\"Carga marítima\",\"Envíos desde China\",\"Envíos desde Miami\"]}<\/script>
```

**Step 3: Verify JSON-LD is present**

```bash
python3 -c "
content = open('index.html').read()
print('json-ld ✓' if 'application/ld+json' in content or 'application\\/ld+json' in content else 'json-ld ✗')
print('LocalBusiness ✓' if 'LocalBusiness' in content else 'LocalBusiness ✗')
"
```

Expected: both ✓

**Step 4: Commit**

```bash
git add index.html
git commit -m "add JSON-LD LocalBusiness structured data for Google rich results"
```
