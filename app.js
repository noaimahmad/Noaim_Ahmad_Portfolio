
const root = document.documentElement;
const savedTheme = localStorage.getItem("theme");
if (!savedTheme && window.matchMedia("(prefers-color-scheme: light)").matches) {
  root.setAttribute("data-theme", "light");
}
if (savedTheme === "light") root.setAttribute("data-theme", "light");

// Theme toggle
const themeBtn = document.getElementById("themeToggle");
function setIcon() {
  themeBtn.textContent =
    root.getAttribute("data-theme") === "light" ? "☀️" : "🌙";
}
if (themeBtn) {
  setIcon();
  themeBtn.addEventListener("click", () => {
    const light = root.getAttribute("data-theme") === "light";
    root.setAttribute("data-theme", light ? "" : "light");
    localStorage.setItem("theme", light ? "dark" : "light");
    setIcon();
  });
}

// Mobile nav
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navLinks
    .querySelectorAll("a")
    .forEach((a) =>
      a.addEventListener("click", () => navLinks.classList.remove("open"))
    );
}

// Scroll progress
const bar = document.querySelector(".progress .bar");
const onScroll = () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  if (bar) bar.style.width = scrolled + "%";
};
document.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Parallax (throttled)
const parallax = document.querySelector(".parallax");
let rafId = null;
if (parallax) {
  window.addEventListener("mousemove", (e) => {
    if (rafId) return; // throttle via rAF
    rafId = requestAnimationFrame(() => {
      const x = (e.clientX / innerWidth - 0.5) * 10;
      const y = (e.clientY / innerHeight - 0.5) * 10;
      parallax.style.transform = `translate(${x}px, ${y}px)`;
      rafId = null;
    });
  });
}

// IntersectionObserver for reveals
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "80px" }
);
document.querySelectorAll(".reveal, .card").forEach((el) => io.observe(el));


const projects = [
  {
    id: 1,
    type: "web",

    title: "Image Search Engine",
    desc: "Responsive image search using Unsplash API with infinite scroll.",
    tags: ["HTML", "CSS", "JS", "API"],
    cover: "image_search_engine.png",
    category: "tools",
    live: "https://noaimahmad.github.io/Image-Search-Engine/",
    source: "https://github.com/noaimahmad/Image-Search-Engine",
  },
  {
    id: 2,
    title: "Text-to-Speech App",
    type: "tools",
    desc: "Built a responsive text-to-speech tool where users can write text and listen in different voices.",
    cover: "text_to_speech.png",
    tags: ["JS", "Web Speech"],
    live: "https://noaimahmad.github.io/Text-to-Speech-Converter/",
    source: "https://github.com/noaimahmad/Text-to-Speech-Converter",
  },
  {
    id: 3,
    title: "Crypto Currency Website",
    type: "web",
    desc: "Cards, charts, and news with REST API.",
    cover: "crypto_website.png",
    tags: ["HTML", "CSS", "JS", "API", "Charts"],
    live: "https://noaimahmad.github.io/Crypto-Currency-Website/",
    source: "https://github.com/noaimahmad/Crypto-Currency-Website",
  },
  {
    id: 4,
    title: "Foodies Mirror Website",
    type: "web",
    desc: "A responsive website designed for the Foodies Mirror YouTube channel, featuring recipes, food blogs, and video integration.",
    cover: "foodies_mirror.png",
    tags: ["HTML", "JavaScript", "Bootstrap"],
    live: "https://noaimahmad.github.io/Foodies-Mirror/index.html",
    source: "https://github.com/noaimahmad/Foodies-Mirror",
  },
  {
    id: 5,
    title: "Weather App",
    type: "app",
    desc: "A responsive weather app that fetches real-time data from OpenWeather API and displays temperature, conditions, and location details.",
    cover: "weather_app.png",
    tags: ["HTML", "CSS", "JavaScript", "API"],
    live: "https://noaimahmad.github.io/Weather-App/",
    source: "https://github.com/noaimahmad/Weather-App",
  },

  {
    id: 6,
    title: "The Afghanistan Tourism Website",
    type: "web",
    desc: "A responsive tourism website showcasing Afghanistan’s culture, heritage, cuisine, and destinations — built with clean UI design and smooth navigation.",
    cover: "the_tourism.png",
    tags: ["HTML", "CSS", "JavaScript"],
    live: "https://noaimahmad.github.io/The-Tourism-Website/",
    source: "https://github.com/noaimahmad/The-Tourism-Website/tree/main",
  },
];

// Render cards (with skeletons for better perceived speed)
const grid = document.getElementById("projectGrid");
function renderSkeleton(n = 6) {
  const s = Array.from(
    { length: n },
    () =>
      `<article class="card project"><div class="thumb skeleton"></div><div class="pad"><div class="skeleton line"></div><div class="skeleton line short"></div></div></article>`
  ).join("");
  grid.innerHTML = s;
}
function renderCards(items) {
  grid.innerHTML = items
    .map(
      (p) => `
    <article class="card project reveal" data-type="${
      p.type
    }" data-title="${p.title.toLowerCase()}">
      <img class="thumb" src="${p.cover}" alt="${p.title}" loading="lazy"/>
      <div class="pad">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="tags">${p.tags
          .map((t) => `<span>${t}</span>`)
          .join("")}</div>
        <div class="actions">
          <button class="btn" data-id="${
            p.id
          }" data-action="details">Details</button>
          <a class="btn-ghost" href="${
            p.live
          }" target="_blank" rel="noopener">Live</a>
        </div>
      </div>
    </article>
  `
    )
    .join("");
  document.querySelectorAll(".card.project").forEach((el) => io.observe(el));
}
if (grid) {
  renderSkeleton(projects.length);
  // simulate async
  setTimeout(() => renderCards(projects), 200);
}

// Filter + search
const chips = document.querySelectorAll(".chip");
let activeFilter = "all";
chips.forEach((c) =>
  c.addEventListener("click", () => {
    chips.forEach((x) => x.classList.remove("active"));
    c.classList.add("active");
    activeFilter = c.dataset.filter;
    applyFilter();
  })
);
const search = document.getElementById("searchInput");
if (search) search.addEventListener("input", applyFilter);
function applyFilter() {
  const q = (search?.value || "").trim().toLowerCase();
  const filtered = projects.filter(
    (p) =>
      (activeFilter === "all" || p.type === activeFilter) &&
      (!q ||
        p.title.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q))
  );
  renderCards(filtered);
}

// Modal
const modal = document.getElementById("projectModal");
if (grid && modal) {
  const closeBtn = modal.querySelector(".close");
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest('[data-action="details"]');
    if (!btn) return;
    const id = +btn.dataset.id;
    const p = projects.find((x) => x.id === id);
    if (!p) return;
    modal.querySelector(".modal-cover").src = p.cover;
    modal.querySelector(".modal-title").textContent = p.title;
    modal.querySelector(".modal-desc").textContent = p.desc;
    modal.querySelector(".modal-tags").innerHTML = p.tags
      .map((t) => `<span class="chip">${t}</span>`)
      .join("");
    modal.querySelector("#liveDemo").href = p.live;
    modal.querySelector("#sourceCode").href = p.source;
    modal.showModal();
  });
  closeBtn.addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  });
}

// Contact demo

  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("formStatus");
  const consent = document.getElementById("consent");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!consent.checked) {
      statusEl.textContent = "Please agree to be contacted back.";
      return;
    }

    statusEl.textContent = "Sending…";

    try {
      const res = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      });

      if (res.ok) {
        statusEl.textContent = "✅ Thanks! Your message has been sent.";
        form.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        statusEl.textContent = data?.errors?.map(e => e.message).join(", ") || "❌ Something went wrong. Please try again.";
      }
    } catch (err) {
      statusEl.textContent = "❌ Network error. Check your connection and try again.";
      console.error(err);
    }
  });



// Footer year + smooth scroll
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Small skeleton styles (kept here for simplicity)
const style = document.createElement("style");
style.textContent = `.skeleton{background:linear-gradient(90deg,#ffffff0a,#ffffff15,#ffffff0a);background-size:200% 100%;animation:shimmer 1.2s infinite}.skeleton.line{height:16px;margin:8px 0;border-radius:8px}.skeleton.line.short{width:60%}@keyframes shimmer{0%{background-position:0 0}100%{background-position:200% 0}}`;
document.head.appendChild(style);




