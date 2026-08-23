/* ============================================================
   ANIRUDDHA ADAK — PERSONAL AI AGENCY · site engine
   particles · reveals · counters · tilt · typewriter · filters
   ============================================================ */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
})();
