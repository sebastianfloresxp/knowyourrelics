const atlasData = window.RELICS_ATLAS || {};
const atlasRelics = Array.isArray(atlasData.relics) ? atlasData.relics : [];

const homeStatsEl = document.querySelector("#home-stats");
const featuredDestinationsEl = document.querySelector("#featured-destinations");
const featuredCollectionsEl = document.querySelector("#featured-collections");
const pilgrimageRoutesEl = document.querySelector("#pilgrimage-routes");
const spotlightGridEl = document.querySelector("#spotlight-grid");
const editorialFeatureEl = document.querySelector("#editorial-feature");
const footerColumnsEl = document.querySelector("#footer-columns");
const heroFeatureCopy = document.querySelector("#hero-feature-copy");
const heroSearch = document.querySelector("#hero-search");
const newsletterForm = document.querySelector("#footer-newsletter");
const newsletterNote = document.querySelector("#newsletter-note");

const numberFormat = new Intl.NumberFormat();

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character] || character;
  });
}

function pluralize(count, singular, plural = `${singular}s`) {
  return `${numberFormat.format(count)} ${count === 1 ? singular : plural}`;
}

function uniqueCount(values) {
  return new Set(values.filter(Boolean)).size;
}

function buildAtlasQueryHref(query) {
  return `./atlas.html?q=${encodeURIComponent(query)}`;
}

function buildRouteHref(route) {
  if (route && route.slug) {
    return `./atlas.html?route=${encodeURIComponent(route.slug)}`;
  }

  if (route && Array.isArray(route.cities) && route.cities.length) {
    return buildAtlasQueryHref(route.cities[0]);
  }

  return "./atlas.html";
}

function renderHomeStats() {
  if (!homeStatsEl) {
    return;
  }

  const namedCities = atlasRelics
    .map((entry) => entry.city)
    .filter((city) => city && city !== "Various locations");
  const namedCountries = atlasRelics
    .map((entry) => entry.country)
    .filter((country) => country && country !== "Unspecified");
  const devotionalSubjects = atlasRelics
    .map((entry) => entry.saintOrEvent)
    .filter((item) => item && !/^more than /i.test(item));

  const stats = [
    {
      label: "Directory records",
      value: numberFormat.format(atlasRelics.length),
      note: "Curated shrine entries plus imported published inventories.",
    },
    {
      label: "Named cities",
      value: numberFormat.format(uniqueCount(namedCities)),
      note: "Locations with city-level records in the current database.",
    },
    {
      label: "Countries",
      value: numberFormat.format(uniqueCount(namedCountries)),
      note: "Cross-border coverage spanning Europe, North America, and Asia.",
    },
    {
      label: "Saints and subjects",
      value: numberFormat.format(uniqueCount(devotionalSubjects)),
      note: "Named saints, Passion objects, and devotional subjects in the current index.",
    },
    {
      label: "Imported source files",
      value: numberFormat.format((atlasData.sourceCatalog || []).length),
      note: "Official shrine lists, diocesan PDFs, apostolate custody lists, and exposition inventories.",
    },
  ];

  homeStatsEl.innerHTML = stats
    .map(
      (stat) => `
        <article class="stat-card reveal">
          <p class="card-kicker">${escapeHtml(stat.label)}</p>
          <h3>${escapeHtml(stat.value)}</h3>
          <p>${escapeHtml(stat.note)}</p>
        </article>
      `
    )
    .join("");
}

function renderHeroFeature() {
  if (!heroFeatureCopy) {
    return;
  }

  const importedCount = atlasData.meta ? atlasData.meta.importedEntryCount || 0 : 0;
  const sourceCount = atlasData.meta ? atlasData.meta.importedSourceCount || 0 : 0;

  heroFeatureCopy.textContent = `${numberFormat.format(importedCount)} imported records from ${numberFormat.format(
    sourceCount
  )} published source files, with especially large public collections in Pittsburgh, Livonia, Maria Stein, and Morton Grove.`;
}

function renderFeaturedDestinations() {
  if (!featuredDestinationsEl) {
    return;
  }

  featuredDestinationsEl.innerHTML = (atlasData.featuredDestinations || [])
    .map(
      (card) => `
        <article class="visual-card reveal">
          <a class="visual-card-link" href="${buildAtlasQueryHref(card.query || card.title)}">
            <div class="visual-card-media">
              <img src="${escapeHtml(card.image)}" alt="${escapeHtml(card.title)}" loading="lazy" />
            </div>
            <div class="visual-card-copy">
              <p class="card-kicker">${escapeHtml(card.category)}</p>
              <h3>${escapeHtml(card.title)}</h3>
              <p>${escapeHtml(card.description)}</p>
              <span class="card-cta">Open records</span>
            </div>
          </a>
        </article>
      `
    )
    .join("");
}

function renderCollections() {
  if (!featuredCollectionsEl) {
    return;
  }

  featuredCollectionsEl.innerHTML = (atlasData.featuredCollections || [])
    .map(
      (site) => `
        <article class="collection-card reveal">
          <div class="card-topline">
            <span class="pill">${escapeHtml(site.country)}</span>
            <span class="count-badge">${escapeHtml(pluralize(site.count, "record"))}</span>
          </div>
          <h3>${escapeHtml(site.title)}</h3>
          <p class="card-meta">${escapeHtml(site.city)} · ${escapeHtml(site.institutionType)}</p>
          <p>${escapeHtml(site.summary)}</p>
          <a class="text-link" href="${buildAtlasQueryHref(site.query || site.city)}">Open records</a>
        </article>
      `
    )
    .join("");
}

function renderRoutes() {
  if (!pilgrimageRoutesEl) {
    return;
  }

  pilgrimageRoutesEl.innerHTML = (atlasData.pilgrimageRoutes || [])
    .map(
      (route) => `
        <article class="visual-card theme-card reveal">
          <a class="visual-card-link" href="${buildRouteHref(route)}">
            <div class="visual-card-media">
              <img src="${escapeHtml(route.image)}" alt="${escapeHtml(route.title)}" loading="lazy" />
            </div>
            <div class="visual-card-copy">
              <p class="card-kicker">${escapeHtml(route.scope)}</p>
              <h3>${escapeHtml(route.title)}</h3>
              <p>${escapeHtml(route.description)}</p>
              <span class="card-cta">Open grouping</span>
            </div>
          </a>
        </article>
      `
    )
    .join("");
}

function renderSpotlights() {
  if (!spotlightGridEl) {
    return;
  }

  spotlightGridEl.innerHTML = (atlasData.spotlightIds || [])
    .map((id) => atlasRelics.find((entry) => entry.id === id))
    .filter(Boolean)
    .map(
      (entry) => `
        <article class="record-card reveal">
          <div class="record-card-head">
            <span class="class-pill ${escapeHtml(entry.classType)}">${escapeHtml(entry.classLabel)}</span>
            <span class="pill">${escapeHtml(entry.institutionType)}</span>
          </div>
          <h3>${escapeHtml(entry.relicName)}</h3>
          <p class="card-meta">${escapeHtml(entry.city)}, ${escapeHtml(entry.country)} · ${escapeHtml(entry.shrine)}</p>
          <p>${escapeHtml(entry.summary)}</p>
          <p class="record-line"><strong>Where:</strong> ${escapeHtml(entry.whereLocated)}</p>
          <a class="text-link" href="${buildAtlasQueryHref(entry.city)}">Open ${escapeHtml(entry.city)} records</a>
        </article>
      `
    )
    .join("");
}

function renderEditorialFeature() {
  if (!editorialFeatureEl || !atlasData.editorialFeature) {
    return;
  }

  const feature = atlasData.editorialFeature;

  editorialFeatureEl.innerHTML = `
    <article class="editorial-card reveal">
      <div class="editorial-card-media">
        <img src="${escapeHtml(feature.image)}" alt="${escapeHtml(feature.title)}" loading="lazy" />
      </div>
      <div class="editorial-card-copy">
        <p class="eyebrow">${escapeHtml(feature.eyebrow)}</p>
        <h2>${escapeHtml(feature.title)}</h2>
        <p>${escapeHtml(feature.description)}</p>
        <a class="button button-primary" href="${escapeHtml(feature.linkHref)}">${escapeHtml(feature.linkLabel)}</a>
      </div>
    </article>
  `;
}

function renderFooterColumns() {
  if (!footerColumnsEl) {
    return;
  }

  footerColumnsEl.innerHTML = (atlasData.footerColumns || [])
    .map(
      (column) => `
        <section class="footer-column">
          <h3>${escapeHtml(column.title)}</h3>
          <ul>
            ${(column.links || [])
              .map(
                (link) => `
                  <li>
                    <a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>
                  </li>
                `
              )
              .join("")}
          </ul>
        </section>
      `
    )
    .join("");
}

function setupHeroSearch() {
  if (!heroSearch) {
    return;
  }

  heroSearch.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(heroSearch);
    const query = String(formData.get("q") || "").trim();
    const target = new URL("./atlas.html", window.location.href);

    if (query) {
      target.searchParams.set("q", query);
    }

    window.location.href = target.href;
  });
}

function setupRailControls() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-rail-target]");
    if (!button) {
      return;
    }

    const rail = document.getElementById(button.dataset.railTarget);
    if (!rail) {
      return;
    }

    const firstCard = rail.querySelector(".visual-card");
    const step = firstCard ? firstCard.getBoundingClientRect().width + 24 : rail.clientWidth * 0.8;
    const direction = button.dataset.direction === "prev" ? -1 : 1;

    rail.scrollBy({
      left: step * direction,
      behavior: "smooth",
    });
  });
}

function setupNewsletter() {
  if (!newsletterForm || !newsletterNote) {
    return;
  }

  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    newsletterNote.textContent = "This static build does not collect email. The form is included as part of the site layout.";
  });
}

function setupReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => observer.observe(element));
}

renderHeroFeature();
renderHomeStats();
renderFeaturedDestinations();
renderCollections();
renderRoutes();
renderSpotlights();
renderEditorialFeature();
renderFooterColumns();
setupHeroSearch();
setupRailControls();
setupNewsletter();
setupReveal();
