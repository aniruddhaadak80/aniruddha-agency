/* ============================================================
   ANIRUDDHA ADAK — PERSONAL AI AGENCY · site engine
   particles · reveals · counters · tilt · typewriter · filters
   ============================================================ */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    const COLORS = ["34,211,238", "139,92,246", "236,72,153", "163,230,53"];
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
})();
