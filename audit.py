import os, re, json, sys, glob
root = r"C:\Users\ANIRUDDHA\Desktop\Projects\aniruddha-agency"
pages = ["index.html","about.html","projects.html","agency.html","future.html","writing.html","contact.html"]
issues = []
for f in pages:
    src = open(os.path.join(root, f), encoding="utf-8").read()
    mt = re.search(r"<title>(.*?)</title>", src, re.S)
    if not mt:
        issues.append(f + ": missing title")
    elif not (35 < len(mt.group(1)) < 120):
        issues.append(f + ": title length " + str(len(mt.group(1))) + " -> " + mt.group(1)[:80])
    if src.count("<h1") != 1:
        issues.append(f + ": h1 count " + str(src.count("<h1")))
    if 'name="description"' not in src:
        issues.append(f + ": no meta description")
    if 'name="viewport"' not in src:
        issues.append(f + ": no viewport")
    if 'rel="canonical"' not in src:
        issues.append(f + ": no canonical")
    for m in re.finditer(r"<img([^>]*)>", src):
        attrs = m.group(1)
        if "alt=" not in attrs:
            issues.append(f + ": img missing alt: " + attrs[:90])
    for m in re.finditer(r'<a[^>]*target="_blank"[^>]*>', src):
        tag = m.group(0)
        if 'rel="noopener"' not in tag:
            issues.append(f + ": target _blank without noopener: " + tag[:80])
    hrefs = re.findall(r'(?:href|src)="([^"#]+)"', src)
    for url in hrefs:
        if url.startswith(("http", "mailto:", "#", "data:", "tel:")):
            continue
        phys = os.path.join(root, url)
        if not os.path.isfile(phys):
            issues.append(f + ": broken local link " + url)
    ids = re.findall(r'id="([^"]+)"', src)
    dup = set([x for x in ids if ids.count(x) > 1])
    if dup:
        issues.append(f + ": duplicate ids " + str(dup))
    if "preloader" not in src:
        issues.append(f + ": missing preloader")
    if "cursor-glow" not in src:
        issues.append(f + ": missing cursor-glow")
    if "nav-search" not in src:
        issues.append(f + ": missing nav-search")
css = open(os.path.join(root, "styles.css"), encoding="utf-8").read()
if css.count("{") != css.count("}"):
    issues.append("styles.css brace mismatch " + str(css.count("{")) + " vs " + str(css.count("}")))
for old in ["#22d3ee", "#8b5cf6", "#ec4899", "#a3e635"]:
    if old in css:
        issues.append("styles.css still has old color " + old)
js = open(os.path.join(root, "script.js"), encoding="utf-8").read()
if "preloader" not in js:
    issues.append("script.js missing preloader logic")
if "cursor-glow" not in js:
    issues.append("script.js missing cursor aura")
if "wrapWords" not in js:
    issues.append("script.js heading splitter missing")
for f in ["favicon.svg", "og-cover.png", "assets/aniruddha-photo.jpg"]:
    if not os.path.isfile(os.path.join(root, f)):
        issues.append("missing asset " + f)
print("NO ISSUES FOUND" if not issues else "ISSUES")
for i in issues:
    print(" -", i)
