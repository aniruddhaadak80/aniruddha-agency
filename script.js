/* ============================================================
   ANIRUDDHA ADAK — PERSONAL AI AGENCY · site engine
   particles · reveals · counters · tilt · typewriter · filters
   ============================================================ */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  /* ---------- preloader ---------- */
  const pre = document.querySelector(".preloader");
  if (pre) {
    const hidePre = () => { pre.classList.add("done"); setTimeout(() => pre.remove(), 700); };
    if (document.readyState === "complete") setTimeout(hidePre, 500);
    else window.addEventListener("load", () => setTimeout(hidePre, 400));
    setTimeout(hidePre, 2600);
  }

  /* ---------- cursor aura (desktop) ---------- */
  const aura = document.querySelector(".cursor-glow");
  if (aura && window.matchMedia("(pointer:fine)").matches && !prefersReduced) {
    let ax = -200, ay = -200, tx = -200, ty = -200;
    window.addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY; aura.classList.add("on");
    }, { passive: true });
    (function auraLoop() {
      ax += (tx - ax) * 0.08; ay += (ty - ay) * 0.08;
      aura.style.transform = `translate(${ax}px,${ay}px) translate(-50%,-50%)`;
      requestAnimationFrame(auraLoop);
    })();
    document.addEventListener("mouseleave", () => aura.classList.remove("on"));
  }

  /* ---------- magnetic buttons ---------- */
  if (window.matchMedia("(pointer:fine)").matches && !prefersReduced) {
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.classList.add("magnet");
      btn.addEventListener("mousemove", (ev) => {
        const r = btn.getBoundingClientRect();
        const x = ev.clientX - r.left - r.width / 2;
        const y = ev.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.18}px,${y * 0.22 - 2}px)`;
      });
      btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
    });
  }

  /* ---------- heading word rise ---------- */
  const wrapWords = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 3 && child.textContent.trim()) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
          const w = document.createElement("span"); w.className = "w";
          const wi = document.createElement("span"); wi.className = "wi"; wi.textContent = part;
          w.appendChild(wi); frag.appendChild(w);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1 && !child.classList.contains("w")) {
        wrapWords(child);
      }
    });
  };
  document.querySelectorAll(".h2").forEach((h) => { if (h.dataset.words !== "no") wrapWords(h); });
  if ("IntersectionObserver" in window) {
    const hio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.querySelectorAll(".wi").forEach((wi, i) => (wi.style.transitionDelay = `${i * 55}ms`));
          e.target.classList.add("words-in");
          hio.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    document.querySelectorAll(".h2").forEach((h) => hio.observe(h));
  } else {
    document.querySelectorAll(".h2").forEach((h) => h.classList.add("words-in"));
  }

  /* ---------- image fade-in ---------- */
  const markLoaded = (img) => {
    if (img.complete) img.classList.add("loaded");
    else img.addEventListener("load", () => img.classList.add("loaded"), { once: true });
    img.addEventListener("error", () => img.classList.add("loaded"), { once: true });
  };
  document.querySelectorAll(".thumb img,.portrait img").forEach(markLoaded);

  /* ---------- scroll progress bar ---------- */
  const progress = document.getElementById("scroll-progress");
  if (progress) {
    const onProg = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", onProg, { passive: true });
    onProg();
  }

  /* ---------- Mobile nav ---------- */
  const burger = document.querySelector(".burger");
  const navLinks = document.querySelector(".nav-links");
  if (burger && navLinks) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("open");
      navLinks.classList.toggle("open");
      document.body.style.overflow = navLinks.classList.contains("open") ? "hidden" : "";
    });
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        burger.classList.remove("open");
        navLinks.classList.remove("open");
        document.body.style.overflow = "";
      })
    );
  }

  /* ---------- Active nav link ---------- */
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === page || (page === "" && href === "index.html")) a.classList.add("active");
  });

  /* ---------- Nav background on scroll ---------- */
  const nav = document.querySelector(".nav");
  if (nav) {
    const onScroll = () => {
      nav.style.background = window.scrollY > 40 ? "rgba(5,7,15,.88)" : "rgba(5,7,15,.62)";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const runCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "+";
    const dur = 1600;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString() + (p === 1 ? suffix : "");
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            prefersReduced
              ? (e.target.textContent = e.target.dataset.count.toLocaleString() + (e.target.dataset.suffix || "+"))
              : runCounter(e.target);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => cio.observe(c));
  } else {
    counters.forEach((c) => (c.textContent = c.dataset.count.toLocaleString() + (c.dataset.suffix || "+")));
  }

  /* ---------- Typewriter roles ---------- */
  const roleEl = document.getElementById("role-typer");
  if (roleEl) {
    const roles = JSON.parse(roleEl.dataset.roles);
    let ri = 0, ci = 0, deleting = false;
    const tick = () => {
      const word = roles[ri];
      ci += deleting ? -1 : 1;
      roleEl.textContent = word.slice(0, ci);
      let delay = deleting ? 38 : 74;
      if (!deleting && ci === word.length) { delay = 1900; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 420; }
      setTimeout(tick, prefersReduced ? 0 : delay);
    };
    tick();
  }

  /* ---------- 3D tilt cards ---------- */
  if (!prefersReduced && window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("mousemove", (ev) => {
        const r = card.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width - 0.5;
        const y = (ev.clientY - r.top) / r.height - 0.5;
        card.style.transform = `translateY(-7px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg)`;
        const glow = card.querySelector(".card-glow");
        if (glow) {
          glow.style.left = `${x * 100 + 50}%`;
          glow.style.top = `${y * 100 + 50}%`;
          glow.style.right = "auto";
        }
      });
      card.addEventListener("mouseleave", () => (card.style.transform = ""));
    });
  }

  /* ---------- Project filter chips ---------- */
  const chips = document.querySelectorAll(".chip[data-filter]");
  if (chips.length) {
    chips.forEach((chip) =>
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        const f = chip.dataset.filter;
        document.querySelectorAll("[data-cat]").forEach((card) => {
          const cats = (card.dataset.cat || "").split(" ");
          card.classList.toggle("hide-proj", !(f === "all" || cats.includes(f)));
        });
      })
    );
  }

  /* ---------- Particle constellation (hero canvas) ---------- */
  const canvas = document.getElementById("particles");
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext("2d");
    let w, h, pts = [], raf;
    const COLORS = ["239,68,68", "250,250,250", "185,28,28", "255,107,94"];
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(Math.floor((w * h) / 15000), 110);
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.7 + 0.5,
        c: COLORS[(Math.random() * COLORS.length) | 0],
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 7);
        ctx.fillStyle = `rgba(${p.c},.75)`;
        ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 12000) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(${pts[i].c},${(1 - d2 / 12000) * 0.16})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener("resize", () => { cancelAnimationFrame(raf); resize(); draw(); });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf); else { cancelAnimationFrame(raf); draw(); }
    });
  }

  /* ---------- Year stamp ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Back to top ---------- */
  const backTop = document.querySelector(".back-top");
  if (backTop) {
    window.addEventListener(
      "scroll",
      () => backTop.classList.toggle("show", window.scrollY > 600),
      { passive: true }
    );
    backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------- Copy-to-clipboard + toast ---------- */
  const toast = document.querySelector(".toast");
  let toastTimer;
  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
  };
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      ev.preventDefault();
      const text = btn.dataset.copy;
      const done = () => showToast("copied to clipboard: " + text);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(done);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta); done();
      }
    });
  });

  /* ---------- Command palette (Ctrl/Cmd + K) ---------- */
  const overlay = document.querySelector(".cmdk-overlay");
  if (overlay) {
    const input = overlay.querySelector(".cmdk-input");
    const list = overlay.querySelector(".cmdk-list");
    const items = [
      { t: "Home", s: "page", u: "index.html" },
      { t: "About — story & timeline", s: "page", u: "about.html" },
      { t: "Projects — full archive", s: "page", u: "projects.html" },
      { t: "Agency — services", s: "page", u: "agency.html" },
      { t: "Future — predictions", s: "page", u: "future.html" },
      { t: "Writing — articles", s: "page", u: "writing.html" },
      { t: "Contact — all links", s: "page", u: "contact.html" },
      { t: "GitHub — aniruddhaadak80", s: "external", u: "https://github.com/aniruddhaadak80" },
      { t: "X — @aniruddhadak", s: "external", u: "https://x.com/aniruddhadak" },
      { t: "LinkedIn", s: "external", u: "https://www.linkedin.com/in/aniruddha-adak" },
      { t: "DEV Community", s: "external", u: "https://dev.to/aniruddhaadak" },
      { t: "Email me", s: "action", u: "mailto:aniruddhaadak80@gmail.com" },
    ];
    const render = (q) => {
      const filtered = items.filter((i) => i.t.toLowerCase().includes(q.toLowerCase()));
      list.innerHTML = filtered
        .map((i, idx) => `<li data-u="${i.u}" class="${idx === 0 ? "sel" : ""}">${i.t}<span>${i.s}</span></li>`)
        .join("");
      list.querySelectorAll("li").forEach((li) =>
        li.addEventListener("click", () => { window.location.href = li.dataset.u; })
      );
    };
    const open = () => { overlay.classList.add("open"); input.value = ""; render(""); input.focus(); };
    const close = () => overlay.classList.remove("open");
    document.querySelectorAll("[data-cmdk-open]").forEach((b) => b.addEventListener("click", open));
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); open(); }
      if (e.key === "/" && !overlay.classList.contains("open") && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); open(); }
      if (e.key === "Escape") close();
      if (overlay.classList.contains("open") && (e.key === "Enter" || e.key === "ArrowDown" || e.key === "ArrowUp")) {
        e.preventDefault();
        const lis = [...list.querySelectorAll("li")];
        if (!lis.length) return;
        let idx = lis.findIndex((li) => li.classList.contains("sel"));
        if (e.key === "ArrowDown") { lis[idx].classList.remove("sel"); idx = (idx + 1) % lis.length; lis[idx].classList.add("sel"); }
        if (e.key === "ArrowUp") { lis[idx].classList.remove("sel"); idx = (idx - 1 + lis.length) % lis.length; lis[idx].classList.add("sel"); }
        if (e.key === "Enter") window.location.href = lis[idx].dataset.u;
      }
    });
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    input.addEventListener("input", () => render(input.value));
  }

  /* ---------- terminal widget ---------- */
  const termInput = document.querySelector(".term-input");
  const termBody = document.querySelector(".term-body");
  if (termInput && termBody) {
    const cmds = {
      help: "available: help · projects · agency · future · writing · contact · about · github · x · linkedin · email · clear",
      projects: () => (location.href = "projects.html"),
      agency: () => (location.href = "agency.html"),
      future: () => (location.href = "future.html"),
      writing: () => (location.href = "writing.html"),
      contact: () => (location.href = "contact.html"),
      about: () => (location.href = "about.html"),
      github: () => window.open("https://github.com/aniruddhaadak80", "_blank"),
      x: () => window.open("https://x.com/aniruddhadak", "_blank"),
      linkedin: () => window.open("https://www.linkedin.com/in/aniruddha-adak", "_blank"),
      email: () => (location.href = "mailto:aniruddhaadak80@gmail.com"),
      clear: () => (termBody.innerHTML = ""),
    };
    termInput.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const raw = termInput.value.trim().toLowerCase();
      termBody.insertAdjacentHTML("beforeend", `<div><span class="term-prompt">aniruddha@agency:~$</span> ${raw}</div>`);
      termInput.value = "";
      const fn = cmds[raw];
      if (fn) {
        if (typeof fn === "string") termBody.insertAdjacentHTML("beforeend", `<div style="color:var(--muted)">${fn}</div>`);
        else fn();
      } else if (raw) {
        termBody.insertAdjacentHTML("beforeend", `<div style="color:#f97316">unknown: ${raw} — try help</div>`);
      }
      termBody.scrollTop = termBody.scrollHeight;
    });
  }

  /* ---------- spotlight cards ---------- */
  if (window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".card").forEach((card) => {
      card.classList.add("spot");
      card.addEventListener("mousemove", (ev) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (ev.clientX - r.left) + "px");
        card.style.setProperty("--my", (ev.clientY - r.top) + "px");
      });
    });
  }

  /* ---------- konami easter egg ---------- */
  const konami = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let kIdx = 0;
  document.addEventListener("keydown", (e) => {
    kIdx = e.key === konami[kIdx] ? kIdx + 1 : (e.key === konami[0] ? 1 : 0);
    if (kIdx === konami.length) {
      kIdx = 0;
      document.body.style.animation = "none";
      showToast("agent mode unlocked. you found the easter egg.");
      burstParticles();
    }
  });

  function burstParticles() {
    const c = document.createElement("canvas");
    c.style.cssText = "position:fixed;inset:0;z-index:9999;pointer-events:none";
    c.width = innerWidth; c.height = innerHeight;
    document.body.appendChild(c);
    const ctx = c.getContext("2d");
    const COLORS = ["239,68,68","255,255,255","255,107,94","185,28,28"];
    const parts = Array.from({length: 160}, () => ({
      x: innerWidth/2, y: innerHeight/2,
      vx: (Math.random()-.5)*14, vy: (Math.random()-.5)*14 - 4,
      r: Math.random()*4+1, c: COLORS[(Math.random()*COLORS.length)|0], life: 1,
    }));
    let alive = true;
    (function loop() {
      if (!alive) return;
      ctx.clearRect(0,0,c.width,c.height);
      let anyAlive = false;
      parts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.life -= 0.012;
        if (p.life > 0) {
          anyAlive = true;
          ctx.beginPath();
          ctx.arc(p.x,p.y,p.r,0,7);
          ctx.fillStyle = `rgba(${p.c},${p.life})`;
          ctx.fill();
        }
      });
      if (anyAlive) requestAnimationFrame(loop);
      else { c.remove(); alive = false; }
    })();
    setTimeout(() => { alive = false; c.remove(); }, 5000);
  }

  /* ---------- Kolkata live clock ---------- */
  const clocks = document.querySelectorAll("[data-clock]");
  if (clocks.length) {
    const tick = () => {
      const now = new Date().toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
      });
      clocks.forEach((c) => (c.textContent = now));
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- PWA service worker ---------- */
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
  }

  /* ---------- live GitHub stats (graceful fallback) ---------- */
  const ghRepos = document.getElementById("live-repos");
  const ghFollowers = document.getElementById("live-followers");
  if (ghRepos || ghFollowers) {
    fetch("https://api.github.com/users/aniruddhaadak80")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (ghRepos && d.public_repos) ghRepos.textContent = d.public_repos;
        if (ghFollowers && d.followers) ghFollowers.textContent = d.followers;
      })
      .catch(() => {});
  }

  /* ---------- live DEV articles feed ---------- */
  const liveFeed = document.getElementById("dev-live-feed");
  if (liveFeed) {
    fetch("https://dev.to/api/articles?username=aniruddhaadak&per_page=6")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((arts) => {
        if (!Array.isArray(arts) || !arts.length) return;
        const rows = arts.map((a) => {
          const d = new Date(a.published_at);
          const date = d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
          const desc = (a.description || "").replace(/</g, "&lt;");
          return `<a class="post-row" href="${a.url}" target="_blank" rel="noopener">
            <span class="post-date">${date}</span>
            <div class="post-title"><b>${a.title.replace(/</g, "&lt;")}</b><span>${desc.slice(0, 110)}${desc.length > 110 ? "..." : ""}</span></div>
            <span class="post-tag">&#9829; ${a.positive_reactions_count || 0}</span>
          </a>`;
        }).join("");
        liveFeed.innerHTML = `<div class="live-chip mono">&#9679; live from the dev.to api — refreshes itself</div>` + rows;
      })
      .catch(() => {});
  }

  /* ---------- reading time estimates ---------- */
  document.querySelectorAll(".post-row").forEach((row) => {
    const t = row.querySelector(".post-title span");
    const title = row.querySelector(".post-title b");
    if (!t || !title || t.dataset.rt) return;
    const words = (title.textContent + " " + t.textContent).split(/\s+/).length;
    const mins = Math.max(2, Math.round(words / 25));
    t.dataset.rt = "1";
    t.textContent += ` — about ${mins} min read`;
  });

  /* ---------- tab blur title ---------- */
  const baseTitle = document.title;
  document.addEventListener("visibilitychange", () => {
    document.title = document.hidden ? "agent mode paused — come back" : baseTitle;
  });

  /* ---------- web share ---------- */
  document.querySelectorAll("[data-share]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const data = { title: document.title, text: "Aniruddha Adak — AI Agent Engineer from Kolkata", url: location.origin };
      if (navigator.share) {
        try { await navigator.share(data); } catch (e) {}
      } else {
        try { await navigator.clipboard.writeText(data.url); showToast("link copied: " + data.url); }
        catch (e) { showToast(data.url); }
      }
    });
  });

  /* ---------- keyboard shortcuts modal ---------- */
  const shortcuts = [
    ["Ctrl / Cmd + K", "open command palette"],
    ["/", "quick-open command palette"],
    ["Esc", "close palette or chat"],
    ["&uarr; &darr; + Enter", "navigate palette results"],
    ["&uarr;&uarr;&darr;&darr;&larr;&rarr;&larr;&rarr; B A", "definitely nothing"],
  ];
  const showShortcuts = () => {
    let m = document.querySelector(".shortcuts-modal");
    if (m) { m.classList.add("open"); return; }
    m = document.createElement("div");
    m.className = "shortcuts-modal";
    m.innerHTML = `<div class="shortcuts-box"><h3>keyboard shortcuts</h3>` +
      shortcuts.map((s) => `<div class="sc-row"><span class="kbd">${s[0]}</span><span>${s[1]}</span></div>`).join("") +
      `<button class="btn btn-ghost sc-close">close</button></div>`;
    document.body.appendChild(m);
    m.addEventListener("click", (e) => { if (e.target === m) m.classList.remove("open"); });
    m.querySelector(".sc-close").addEventListener("click", () => m.classList.remove("open"));
  };
  document.addEventListener("keydown", (e) => {
    if (e.key === "?" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) showShortcuts();
  });

  /* ---------- AgentAni chat widget ---------- */
  const buildChat = () => {
    const wrap = document.createElement("div");
    wrap.className = "chatbot";
    wrap.innerHTML = `
      <button class="chat-launcher" aria-label="Chat with AgentAni">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        <span class="chat-dot"></span>
      </button>
      <div class="chat-panel" role="dialog" aria-label="AgentAni chat">
        <div class="chat-head">
          <span class="chat-avatar">AA</span>
          <div class="chat-id"><b>AgentAni</b><span class="mono">&#9679; always on &middot; rule-based, zero cloud</span></div>
          <button class="chat-x" aria-label="Close chat">&times;</button>
        </div>
        <div class="chat-msgs"></div>
        <div class="chat-chips"></div>
        <div class="chat-inrow">
          <input class="chat-in" placeholder="ask about projects, hiring, skills..." aria-label="Message AgentAni">
          <button class="chat-send" aria-label="Send">&rarr;</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);

    const panel = wrap.querySelector(".chat-panel");
    const msgs = wrap.querySelector(".chat-msgs");
    const chipsEl = wrap.querySelector(".chat-chips");
    const input = wrap.querySelector(".chat-in");
    const launcher = wrap.querySelector(".chat-launcher");

    const knowledge = [
      { k: ["project", "built", "portfolio", "work", "app"], r: "Flagship: CareerZen — voice ATS resume analyzer (Gemini + Sarvam AI, Lighthouse 94, MIT). Then 17 more: SkillSphere, VocalScribe, TerraLens, NexusForge, MindCareAI. Full archive with GitHub links on the projects page." },
      { k: ["hire", "price", "cost", "budget", "rate", "freelance", "available", "availability"], r: "He takes commissions: Starter from $499, Agentic Sprint from $1,999, custom retainers. Email aniruddhaadak80@gmail.com or use the agency page. Replies within 24-48 hours." },
      { k: ["skill", "stack", "tech", "language", "framework"], r: "Core: React, Next.js, TypeScript, Node.js, Tailwind + Python, TensorFlow, LangGraph, CrewAI, RAG. The Toolbox section on the home page has animated bars for all of them." },
      { k: ["open source", "github", "pr", "pull", "merge", "contribut"], r: "800+ PRs authored, 354 merged into external repos — 118 in OpenClaw (including merged fix #102951), 44 in Google's Gemini CLI. Pull Shark ×3. Hacktoberfest 2024 + 2025 with 200+ each." },
      { k: ["who", "about", "bio", "yourself", "ani", "aniruddha"], r: "Aniruddha Adak — AI Agent Engineer from Kolkata, final-year B.Tech CSE at BBIT (MAKAUT). Builds autonomous agents, ships open source daily, writes 350+ articles. The about page has the full timeline." },
      { k: ["contact", "email", "reach", "telegram", "phone", "dm"], r: "Fastest: aniruddhaadak80@gmail.com. Also X @aniruddhadak, Telegram t.me/aniruddhaadak, LinkedIn /in/aniruddha-adak. Full directory on the contact page — every profile there is verified." },
      { k: ["future", "agi", "singularity", "superintelligen", "prediction"], r: "His read: computer-use agents go mainstream by 2026-28, open-weight parity at the useful layer, AI accelerating disease research — with honest caution on displacement and agent misuse. Probability-tagged takes on the future page." },
      { k: ["joke", "funny", "fun"], r: "Why did the agent cross the road? The tool call said to. (He posts 100+ AI updates a day on X — humor is a survival skill.)" },
      { k: ["secret", "easter", "konami", "egg"], r: "Up up down down left right left right B A. That is all I will say." },
      { k: ["resume", "cv"], r: "The site IS the resume — every claim links to public evidence: github.com/aniruddhaadak80, dev.to/aniruddhaadak, and the verified credentials on the about page." },
      { k: ["geo", "seo", "llms"], r: "This site practices what it sells: JSON-LD everywhere, llms.txt for AI engines, breadcrumb schema, consistent verified facts. Open llms.txt in the site root — that is the GEO blueprint." },
      { k: ["help", "what can you"], r: "Try: projects · hire · skills · open source · contact · future · joke · secret. Or tap the chips below." },
      { k: ["hello", "hi", "hey", "yo"], r: "Hey. I am AgentAni — a tiny rule-based agent living in this portfolio. Ask about projects, hiring, skills, or open source." },
    ];
    const chips = ["projects", "hire him", "skills", "open source", "contact"];
    chips.forEach((c) => {
      const b = document.createElement("button");
      b.className = "chip";
      b.textContent = c;
      b.addEventListener("click", () => { input.value = c; send(); });
      chipsEl.appendChild(b);
    });

    const add = (html, who) => {
      const d = document.createElement("div");
      d.className = "chat-m " + who;
      d.innerHTML = html;
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
    };
    let greeted = false;
    const answer = (q) => {
      const ql = q.toLowerCase();
      const hit = knowledge.find((item) => item.k.some((kw) => ql.includes(kw)));
      const typing = document.createElement("div");
      typing.className = "chat-m bot typing";
      typing.innerHTML = "<span></span><span></span><span></span>";
      msgs.appendChild(typing); msgs.scrollTop = msgs.scrollHeight;
      setTimeout(() => {
        typing.remove();
        add(hit ? hit.r : "I am a small rule-based agent, so try: projects, hire, skills, open source, contact, future — or type help.", "bot");
      }, 550 + Math.random() * 450);
    };
    const send = () => {
      const v = input.value.trim();
      if (!v) return;
      add(v.replace(/</g, "&lt;"), "user");
      input.value = "";
      answer(v);
    };
    const openChat = () => {
      wrap.classList.add("open");
      launcher.classList.remove("ping");
      if (!greeted) {
        greeted = true;
        add("Hey — Aniruddha here (well, my agent does the typing). Ask about projects, hiring, skills or open source. Or tap a chip below.", "bot");
      }
      setTimeout(() => input.focus(), 250);
    };
    wrap.querySelector(".chat-x").addEventListener("click", () => wrap.classList.remove("open"));
    launcher.addEventListener("click", () => (wrap.classList.contains("open") ? wrap.classList.remove("open") : openChat()));
    wrap.querySelector(".chat-send").addEventListener("click", send);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && wrap.classList.contains("open")) wrap.classList.remove("open");
    });
    setTimeout(() => launcher.classList.add("ping"), 4000);
  };
  buildChat();
})();
