/* ============================================================
   Syadid Multazam — CV
   - tema gelap/terang (tersimpan di localStorage)
   - scroll reveal
   - nav aktif mengikuti section
   - tombol cetak / simpan PDF
   ============================================================ */

(() => {
  "use strict";

  const root = document.documentElement;
  const THEME_KEY = "cv-theme";

  /* ---------- Tema ---------- */
  const themeToggle = document.getElementById("themeToggle");

  const applyTheme = (theme, persist) => {
    root.dataset.theme = theme;
    if (persist) {
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch {
        /* localStorage bisa diblokir, abaikan */
      }
    }
    if (themeToggle) {
      const isDark = theme === "dark";
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute("aria-label", isDark ? "Ganti ke tema terang" : "Ganti ke tema gelap");
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0c0c0d" : "#f7f6f3");
  };

  const savedTheme = (() => {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch {
      return null;
    }
  })();

  const preferredTheme =
    savedTheme ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  applyTheme(preferredTheme, false);

  themeToggle?.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
  });

  /* ---------- Cetak / PDF ---------- */
  document.getElementById("printBtn")?.addEventListener("click", () => window.print());

  /* ---------- Tahun footer ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Scroll reveal ---------- */
  const revealItems = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealItems.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Nav aktif + border topbar ---------- */
  const topbar = document.querySelector(".topbar");
  const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((section) => spy.observe(section));
  }

  const onScroll = () => {
    topbar?.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Animasi ketik untuk role (halus, opsional) ---------- */
  const role = document.querySelector(".role");
  if (role && !reduceMotion) {
    role.animate(
      [
        { opacity: 0, transform: "translateY(6px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 650, delay: 150, easing: "cubic-bezier(0.22,1,0.36,1)", fill: "backwards" }
    );
  }
})();
