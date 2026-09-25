/* =========================================================
   MANA ISHOOT — DATA-DRIVEN INTERACTIONS
   Content source: data.json
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
  const body = document.body;
  const nav = document.querySelector(".nav");
  const menuButton = document.querySelector(".menu");
  const mobileMenu = document.querySelector(".mobile-menu");
  const progress = document.createElement("div");

  let data;
  try {
    const response = await fetch("data.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    data = await response.json();
  } catch (error) {
    console.error("Could not load data.json:", error);
    data = {site:{}, hero:{}, about:{}, categories:[], stats:{}, videos:[]};
  }

  const site = data.site || {};
  const hero = data.hero || {};
  const about = data.about || {};
  const stats = data.stats || {};
  const categories = Array.isArray(data.categories) ? data.categories : [];
  const videos = Array.isArray(data.videos) ? data.videos.filter(v => v && v.url) : [];
  const categoryMap = Object.fromEntries(categories.map(c => [c.id, c]));
  const labelFor = id => categoryMap[id]?.label || String(id || "").replace(/[-_]+/g, " ");
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));

  /* ---------- Bind content from data.json ---------- */
  document.title = site.title || document.title;

  const brandName = document.querySelector(".brand > span");
  if (brandName && site.creator) brandName.textContent = site.creator;

  const heroEyebrow = document.querySelector(".hero .eyebrow");
  if (heroEyebrow && site.role) heroEyebrow.innerHTML = `<i></i> ${esc(site.role)}`;

  const heroText = document.querySelector(".hero-text");
  if (heroText && site.description) heroText.textContent = site.description;

  const heroImage = document.querySelector(".hero-frame img");
  if (heroImage && hero.image) {
    heroImage.src = hero.image;
    heroImage.alt = hero.imageAlt || "Mana iShots";
  }

  const floating = document.querySelector(".floating-card");
  if (floating) {
    const spans = floating.querySelectorAll("span, strong, small");
    if (spans[0] && hero.reachLabel) spans[0].textContent = hero.reachLabel;
    if (spans[1] && hero.reach) spans[1].textContent = hero.reach;
    if (spans[2] && hero.reachNote) spans[2].textContent = hero.reachNote;
  }

  const aboutName = document.querySelector(".creator-name h3");
  if (aboutName && site.creator) {
    const parts = String(site.creator).trim().split(/\s+/);
    const first = parts.shift() || "";
    aboutName.innerHTML = `${esc(first)}<br><span>${esc(parts.join(" "))}</span>`;
  }

  const aboutEyebrow = document.querySelector(".creator-name .eyebrow");
  if (aboutEyebrow && about.eyebrow) aboutEyebrow.textContent = about.eyebrow;

  const aboutHeading = document.querySelector(".about-copy h2");
  if (aboutHeading && about.heading) {
    aboutHeading.innerHTML = `${esc(about.heading)}<br><span>${esc(about.headingAccent || "")}</span>`;
  }

  const aboutDescription = document.querySelector(".about-copy > p");
  if (aboutDescription && about.description) aboutDescription.textContent = about.description;

  const miniList = document.querySelector(".mini-list");
  if (miniList && Array.isArray(about.steps)) {
    miniList.innerHTML = about.steps.map((step, i) =>
      `<div><b>${String(i + 1).padStart(2, "0")}</b> ${esc(step)}</div>`
    ).join("");
  }

  const statValues = [stats.views30Days, stats.interactions, stats.viewers, stats.reelsViews];
  document.querySelectorAll(".stats > div").forEach((item, i) => {
    const strong = item.querySelector("strong");
    if (strong && statValues[i] != null) strong.textContent = statValues[i];
  });

  const profileStats = document.querySelectorAll(".profile-stats span b");
  [stats.posts, stats.followers, stats.following].forEach((value, i) => {
    if (profileStats[i] && value != null) profileStats[i].textContent = value;
  });

  if (site.phone) document.querySelectorAll('a[href^="tel:"]').forEach(link => link.href = `tel:${site.phone}`);
  if (site.instagram) document.querySelectorAll('a[href*="instagram.com"]').forEach(link => link.href = site.instagram);

  const footerCopy = document.querySelector("footer > div + p + span");
  if (footerCopy && site.copyright) footerCopy.textContent = site.copyright;

  /* ---------- Scroll progress ---------- */
  progress.className = "scroll-progress";
  body.appendChild(progress);

  const updateScrollUI = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${docHeight > 0 ? (scrollTop / docHeight) * 100 : 0}%`;
    if (nav) nav.classList.toggle("scrolled", scrollTop > 25);
  };
  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  /* ---------- Mobile navigation ---------- */
  const closeMenu = () => {
    if (!menuButton || !mobileMenu) return;
    menuButton.classList.remove("open");
    mobileMenu.classList.remove("open");
    body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
  };

  if (menuButton && mobileMenu) {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.addEventListener("click", () => {
      const open = !mobileMenu.classList.contains("open");
      menuButton.classList.toggle("open", open);
      mobileMenu.classList.toggle("open", open);
      body.classList.toggle("menu-open", open);
      menuButton.setAttribute("aria-expanded", String(open));
    });
    mobileMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealItems.forEach((element, index) => {
      element.style.setProperty("--delay", `${Math.min(index % 5, 4) * 70}ms`);
      revealObserver.observe(element);
    });
  } else {
    revealItems.forEach(el => el.classList.add("visible"));
  }

  /* ---------- Dynamic categories ---------- */
  const watchCategories = document.getElementById("watchCategories");
  const categoryGrid = document.getElementById("categoryGrid");

  if (watchCategories) {
    watchCategories.innerHTML =
      `<button class="watch-filter active" type="button" data-filter="all">All work</button>` +
      categories.map(c =>
        `<button class="watch-filter" type="button" data-filter="${esc(c.id)}">${esc(c.label)}</button>`
      ).join("");
  }

  if (categoryGrid) {
    categoryGrid.innerHTML = categories.map((c, i) => `
      <a class="category-card visible" href="#gallery-${esc(c.id)}" data-category="${esc(c.id)}">
        <b>${String(i + 1).padStart(2, "0")}</b>
        <h3>${esc(c.label)}</h3>
        <span>${esc(c.subtitle || "")}</span>
        <i>↗</i>
      </a>
    `).join("");
  }

  /* ---------- Active navigation ---------- */
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".nav-links a")];

  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`
        ));
      });
    }, { threshold: 0.2, rootMargin: "-25% 0px -55% 0px" });
    sections.forEach(section => sectionObserver.observe(section));
  }

  /* ---------- Gentle parallax ---------- */
  const parallaxItems = document.querySelectorAll("[data-parallax]");
  if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
    let ticking = false;
    const updateParallax = () => {
      const scroll = window.scrollY;
      parallaxItems.forEach(item => {
        const speed = Number(item.dataset.parallax) || 0.05;
        item.style.transform = `translate3d(0, ${scroll * speed * -1}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------- Category video galleries ---------- */
  const modal = document.getElementById("videoModal");
  const galleryContent = document.getElementById("galleryContent");
  const modalClose = document.querySelector(".modal-close");

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
    if (galleryContent) {
      galleryContent.querySelectorAll("video").forEach(video => video.pause());
      galleryContent.innerHTML = "";
    }
  };

  const videosFor = category => videos.filter(video => video.category === category);

  const openGallery = category => {
    if (!modal || !galleryContent) return;
    const title = labelFor(category);
    const files = videosFor(category);

    galleryContent.innerHTML = files.length ? `
      <div class="section-kicker">Category / ${esc(String(category).toUpperCase())}</div>
      <h2 class="gallery-title">${esc(title)}</h2>
      <div class="gallery-grid">
        ${files.map(video => `
          <video controls playsinline preload="metadata" src="${esc(video.url)}"
            aria-label="${esc(video.title || title)}"></video>
        `).join("")}
      </div>
    ` : `
      <div class="section-kicker">Category / ${esc(String(category).toUpperCase())}</div>
      <h2 class="gallery-title">${esc(title)}</h2>
      <div class="empty-gallery">
        This gallery is ready for your work.<br><br>
        Add a new item to <b>data.json</b> under <b>videos</b>.
      </div>`;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");
  };

  const bindCategoryCards = () => {
    document.querySelectorAll(".category-card").forEach(card => {
      card.addEventListener("click", event => {
        event.preventDefault();
        openGallery(card.dataset.category);
      });
    });
  };
  bindCategoryCards();

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modal) modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeMenu();
      closeModal();
    }
  });

  /* ---------- Smooth internal links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      const navOffset = nav ? nav.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ---------- Featured work rail ---------- */
  const track = document.getElementById("watchTrack");
  const prev = document.getElementById("watchPrev");
  const next = document.getElementById("watchNext");
  const watchProgress = document.getElementById("watchProgress");
  const filterButtons = [...document.querySelectorAll(".watch-filter")];
  const featuredItems = videos.filter(v => v.featured !== false);

  function updateProgress() {
    if (!track || !watchProgress) return;
    const max = track.scrollWidth - track.clientWidth;
    const percent = max > 0 ? (track.scrollLeft / max) * 100 : 100;
    watchProgress.style.width = `${Math.max(8, Math.min(100, percent))}%`;
  }

  function renderFeatured(filter = "all") {
    if (!track) return;

    const visible = filter === "all"
      ? featuredItems
      : featuredItems.filter(item => item.category === filter);

    if (!visible.length) {
      track.innerHTML = `
        <div class="watch-empty">
          <span>COMING SOON</span>
          <h3>${esc(labelFor(filter))}</h3>
          <p>Add a video to <code>data.json</code> under <code>videos</code>.</p>
        </div>`;
      updateProgress();
      return;
    }

    track.innerHTML = visible.map((item, index) => `
      <article class="watch-card">
        <div class="watch-media">
          <video class="watch-video" muted loop playsinline preload="metadata"
            src="${esc(item.url)}" aria-label="${esc(item.title || labelFor(item.category))}"></video>
          <div class="watch-gradient"></div>
          <div class="watch-topline">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <span>${esc(item.label || labelFor(item.category))}</span>
          </div>
          <button class="watch-play" type="button" aria-label="Play video">▶</button>
          <div class="watch-bottom">
            <strong>${esc(item.title || labelFor(item.category))}</strong>
            <small>${esc(item.file || "")}</small>
          </div>
        </div>
      </article>
    `).join("");

    track.querySelectorAll(".watch-card").forEach(card => {
      const video = card.querySelector(".watch-video");
      const button = card.querySelector(".watch-play");

      button.addEventListener("click", () => {
        if (video.paused) video.play().catch(() => {});
        else video.pause();
      });

      video.addEventListener("play", () => {
        button.textContent = "❚❚";
        card.classList.add("is-playing");
      });

      video.addEventListener("pause", () => {
        button.textContent = "▶";
        card.classList.remove("is-playing");
      });

      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.55) video.play().catch(() => {});
            else video.pause();
          });
        }, { threshold: [0, 0.55, 1] });
        observer.observe(card);
      }
    });

    updateProgress();
  }

  const cardWidth = () => {
    const card = track?.querySelector(".watch-card");
    return card ? card.getBoundingClientRect().width + 18 : 420;
  };

  prev?.addEventListener("click", () => track.scrollBy({left: -cardWidth(), behavior: "smooth"}));
  next?.addEventListener("click", () => track.scrollBy({left: cardWidth(), behavior: "smooth"}));
  track?.addEventListener("scroll", updateProgress, {passive: true});

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(x => x.classList.remove("active"));
      button.classList.add("active");
      track.scrollTo({left: 0, behavior: "smooth"});
      renderFeatured(button.dataset.filter);
    });
  });

  renderFeatured("all");

  /* ---------- Hero image subtle movement ---------- */
  const heroFrame = document.querySelector(".hero-frame");
  if (
    heroFrame &&
    window.matchMedia("(min-width: 1001px)").matches &&
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches
  ) {
    let frameTick = false;
    window.addEventListener("scroll", () => {
      if (frameTick) return;
      frameTick = true;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 500);
        heroFrame.style.transform = `translate3d(0, ${y * -0.035}px, 0) rotate(2deg)`;
        frameTick = false;
      });
    }, { passive: true });
  }
});
