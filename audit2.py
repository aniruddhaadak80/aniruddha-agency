import os, re, json
root = r"C:\Users\ANIRUDDHA\Desktop\Projects\aniruddha-agency"
pages = ["index.html","about.html","projects.html","agency.html","future.html","writing.html","contact.html"]
issues = []
for f in pages:
    src = open(os.path.join(root, f), encoding="utf-8").read()
    if not src.rstrip().endswith("</html>"): issues.append(f+": truncated")
    if src.count("<h1") != 1: issues.append(f+": h1 count "+str(src.count("<h1")))
    if 'rel="canonical"' not in src: issues.append(f+": no canonical")
    if 'name="viewport"' not in src: issues.append(f+": no viewport")
    if 'name="description"' not in src: issues.append(f+": no description")
    if "preloader" not in src: issues.append(f+": no preloader")
    if "cursor-glow" not in src: issues.append(f+": no cursor-glow")
    if "nav-search" not in src: issues.append(f+": no nav-search")
    if "grain" not in src: issues.append(f+": no grain")
    if "scroll-progress" not in src: issues.append(f+": no scroll progress")
    for m in re.finditer(r"<img([^>]*)>", src):
        if "alt=" not in m.group(1): issues.append(f+": img no alt: "+m.group(1)[:80])
    for m in re.finditer(r'<a[^>]*target="_blank"[^>]*>', src):
        if 'rel="noopener"' not in m.group(0): issues.append(f+": _blank no noopener")
    for url in re.findall(r'(?:href|src)="([^"#]+)"', src):
        if url.startswith(("http","mailto:","#","data:","tel:")): continue
        if not os.path.isfile(os.path.join(root, url)): issues.append(f+": broken "+url)
    for b in re.findall(r'application/ld\+json>(.*?)</script>', src, re.S):
        try: json.loads(b)
        except Exception as e: issues.append(f+": bad json-ld "+str(e)[:60])
    ids = re.findall(r'id="([^"]+)"', src)
    dups = set(x for x in ids if ids.count(x) > 1)
    if dups: issues.append(f+": dup ids "+str(dups))
css = open(os.path.join(root,"styles.css"), encoding="utf-8").read()
if css.count("{") != css.count("}"): issues.append("css brace mismatch")
for old in ["#22d3ee","#8b5cf6","#ec4899","#a3e635"]:
    if old in css: issues.append("css old color "+old)
js = open(os.path.join(root,"script.js"), encoding="utf-8").read()
for need in ["preloader","cursor-glow","wrapWords","cmdk","terminal","Kolkata","magnetic","back-top","toast","copy"]:
    if need not in js: issues.append("js missing "+need)
print("NO ISSUES" if not issues else "ISSUES:")
for i in issues: print(" -", i)
