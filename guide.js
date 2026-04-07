const atlasGuide = window.RELICS_ATLAS || {};
const guideRelics = Array.isArray(atlasGuide.relics) ? [...atlasGuide.relics] : [];
const routeCatalog = Array.isArray(atlasGuide.pilgrimageRoutes) ? atlasGuide.pilgrimageRoutes : [];
const routeIndex = new Map(routeCatalog.map((route) => [route.slug, route]));

const queryInput = document.querySelector("#query-input");
const classFilter = document.querySelector("#class-filter");
const accessFilter = document.querySelector("#access-filter");
const routeFilter = document.querySelector("#route-filter");
const filterForm = document.querySelector("#filter-form");
const resetFilters = document.querySelector("#reset-filters");
const quickCityChips = document.querySelector("#quick-city-chips");
const resultsSummary = document.querySelector("#results-summary");
const cityGuideGrid = document.querySelector("#city-guide-grid");
const relicGrid = document.querySelector("#relic-grid");
const sourceGrid = document.querySelector("#source-grid");
const footerColumnsEl = document.querySelector("#footer-columns");
const detailOverlay = document.querySelector("#detail-overlay");
const detailContent = document.querySelector("#detail-content");
const detailClose = document.querySelector("#detail-close");
const directoryMetaCount = document.querySelector("#directory-meta-count");
const directoryMetaNote = document.querySelector("#directory-meta-note");
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

function normalize(value) {
  return String(value || "").toLowerCase().trim();
}

function pluralize(count, singular, plural = `${singular}s`) {
  return `${numberFormat.format(count)} ${count === 1 ? singular : plural}`;
}

function buildSearchText(entry) {
  return [
    entry.city,
    entry.country,
    entry.relicName,
    entry.saintOrEvent,
    entry.shrine,
    entry.institutionType,
    entry.classLabel,
    entry.accessLabel,
    entry.sourceLabel,
    entry.sourceTypeLabel,
    entry.summary,
    entry.whereLocated,
    entry.howToSee,
    entry.expositionInfo,
    entry.notes,
  ]
    .join(" ")
    .toLowerCase();
}

function getRouteTitle(slug) {
  const route = routeIndex.get(slug);
  return route ? route.title : "";
}

function getStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return {
    query: params.get("q") || params.get("city") || "",
    classType: params.get("class") || "all",
    accessType: params.get("access") || "all",
    route: params.get("route") || "all",
  };
}

function updateUrl(state) {
  if (window.location.protocol === "file:") {
    return;
  }

  const params = new URLSearchParams();
  if (state.query) {
    params.set("q", state.query);
  }
  if (state.classType !== "all") {
    params.set("class", state.classType);
  }
  if (state.accessType !== "all") {
    params.set("access", state.accessType);
  }
  if (state.route !== "all") {
    params.set("route", state.route);
  }

  const next = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;

  try {
    window.history.replaceState({}, "", next);
  } catch (error) {
    console.warn("Could not update directory URL state.", error);
  }
}

function populateAccessOptions() {
  if (!accessFilter) {
    return;
  }

  const accessOptions = [...new Map(guideRelics.map((entry) => [entry.accessType, entry.accessLabel])).entries()].sort(
    (left, right) => left[1].localeCompare(right[1])
  );

  accessFilter.innerHTML = `
    <option value="all">All access patterns</option>
    ${accessOptions
      .map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`)
      .join("")}
  `;
}

function populateRouteOptions() {
  if (!routeFilter) {
    return;
  }

  routeFilter.innerHTML = `
    <option value="all">All groupings</option>
    ${routeCatalog
      .map(
        (route) => `
          <option value="${escapeHtml(route.slug)}">${escapeHtml(route.title)}</option>
        `
      )
      .join("")}
  `;
}

function renderQuickCities() {
  if (!quickCityChips) {
    return;
  }

  const topCities = guideRelics.reduce((accumulator, entry) => {
    if (!entry.city || entry.city === "Various locations") {
      return accumulator;
    }

    accumulator[entry.city] = (accumulator[entry.city] || 0) + 1;
    return accumulator;
  }, {});

  quickCityChips.innerHTML = Object.entries(topCities)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 14)
    .map(
      ([city]) => `
        <button class="chip" type="button" data-city="${escapeHtml(city)}">${escapeHtml(city)}</button>
      `
    )
    .join("");
}

function setDirectoryMeta() {
  if (!directoryMetaCount || !directoryMetaNote) {
    return;
  }

  const imported = atlasGuide.meta ? atlasGuide.meta.importedEntryCount || 0 : 0;
  const sources = atlasGuide.meta ? atlasGuide.meta.importedSourceCount || 0 : 0;
  const lastUpdated = atlasGuide.meta ? atlasGuide.meta.lastUpdated || "" : "";

  directoryMetaCount.textContent = `${numberFormat.format(imported)} imported records`;
  directoryMetaNote.textContent = `${numberFormat.format(sources)} source files are folded into this directory. Imported dataset timestamp: ${lastUpdated}.`;
}

function filterRelics(state) {
  const query = normalize(state.query);
  const route = routeIndex.get(state.route);
  const routeCities = route ? new Set(route.cities || []) : null;
  const routeTerms = route ? (route.matchTerms || []).map(normalize).filter(Boolean) : [];

  return guideRelics.filter((entry) => {
    const entrySearchText = buildSearchText(entry);
    const matchesQuery = !query || entrySearchText.includes(query);

    const matchesClass = state.classType === "all" || entry.classType === state.classType;
    const matchesAccess = state.accessType === "all" || entry.accessType === state.accessType;
    const matchesRoute =
      !route ||
      (routeCities && routeCities.has(entry.city)) ||
      routeTerms.some((term) => entrySearchText.includes(term));

    return matchesQuery && matchesClass && matchesAccess && matchesRoute;
  });
}

function summarize(filtered, state) {
  if (!resultsSummary) {
    return;
  }

  const cities = new Set(filtered.map((entry) => entry.city).filter(Boolean)).size;
  const countries = new Set(filtered.map((entry) => entry.country).filter(Boolean)).size;
  const sources = new Set(filtered.map((entry) => entry.sourceLabel).filter(Boolean)).size;
  const curated = filtered.filter((entry) => entry.sourceType === "curated_editorial_record").length;
  const routeTitle = state.route !== "all" ? getRouteTitle(state.route) : "";
  const heading = routeTitle
    ? `Grouping: ${routeTitle}`
    : state.query
      ? `Results for "${state.query}"`
      : "Showing the full directory";

  resultsSummary.innerHTML = `
    <article class="summary-card">
      <p class="card-kicker">${escapeHtml(heading)}</p>
      <h2>${escapeHtml(pluralize(filtered.length, "matching record"))}</h2>
      <p>${escapeHtml(pluralize(cities, "city"))} · ${escapeHtml(pluralize(countries, "country"))} · ${escapeHtml(pluralize(sources, "source"))}</p>
    </article>
    <article class="summary-card">
      <p class="card-kicker">Composition</p>
      <p>${escapeHtml(pluralize(curated, "curated shrine entry"))} and ${escapeHtml(pluralize(filtered.length - curated, "imported record"))} in this view.</p>
    </article>
    <article class="summary-card">
      <p class="card-kicker">Search note</p>
      <p>Start with a city. If nothing appears, broaden the query to a country, saint, shrine, relic, or collection name.</p>
    </article>
  `;
}

function groupByCity(filtered) {
  return filtered.reduce((accumulator, entry) => {
    const city = entry.city || "Various locations";
    if (!accumulator[city]) {
      accumulator[city] = [];
    }
    accumulator[city].push(entry);
    return accumulator;
  }, {});
}

function renderCityGuides(filtered) {
  if (!cityGuideGrid) {
    return;
  }

  const cities = Object.entries(groupByCity(filtered)).sort((left, right) => {
    if (right[1].length !== left[1].length) {
      return right[1].length - left[1].length;
    }
    return left[0].localeCompare(right[0]);
  });

  if (!cities.length) {
    cityGuideGrid.innerHTML = `
      <article class="empty-card">
        <h3>No matching locations</h3>
        <p>Try a broader search such as Italy, France, Saint Anthony, cathedral, or relic collection.</p>
      </article>
    `;
    return;
  }

  cityGuideGrid.innerHTML = cities
    .map(([city, entries]) => {
      const institutions = [...new Set(entries.map((entry) => entry.shrine))].slice(0, 3).join(" · ");
      const classes = [...new Set(entries.map((entry) => entry.classLabel))].slice(0, 3).join(" · ");

      return `
        <article class="city-card">
          <div class="card-topline">
            <span class="pill">${escapeHtml(entries[0].country)}</span>
            <span class="count-badge">${escapeHtml(pluralize(entries.length, "record"))}</span>
          </div>
          <h3>${escapeHtml(city)}</h3>
          <p class="card-meta">${escapeHtml(classes)}</p>
          <p>${escapeHtml(institutions)}</p>
          <button class="text-link buttonless" type="button" data-city="${escapeHtml(city)}">Focus ${escapeHtml(city)}</button>
        </article>
      `;
    })
    .join("");
}

function renderRelics(filtered) {
  if (!relicGrid) {
    return;
  }

  if (!filtered.length) {
    relicGrid.innerHTML = `
      <article class="empty-card">
        <h3>No records matched this filter</h3>
        <p>Reset the filters or broaden the search by city, saint, shrine, relic, country, or collection.</p>
      </article>
    `;
    return;
  }

  relicGrid.innerHTML = filtered
    .sort((left, right) => left.city.localeCompare(right.city) || left.relicName.localeCompare(right.relicName))
    .map(
      (entry) => `
        <article class="record-card" data-class="${escapeHtml(entry.classType)}">
          <div class="record-card-top">
            <div class="record-card-title">
              <h3>${escapeHtml(entry.relicName)}</h3>
              <p class="card-meta">${escapeHtml(entry.city)}, ${escapeHtml(entry.country)} · ${escapeHtml(entry.shrine)}</p>
            </div>
            <div class="record-card-head">
              <span class="class-pill ${escapeHtml(entry.classType)}">${escapeHtml(entry.classLabel)}</span>
              <span class="pill">${escapeHtml(entry.institutionType)}</span>
              <span class="pill">${escapeHtml(entry.accessLabel)}</span>
            </div>
          </div>
          <p>${escapeHtml(entry.summary)}</p>
          <dl class="record-details">
            <div>
              <dt>Where</dt>
              <dd>${escapeHtml(entry.whereLocated)}</dd>
            </div>
            <div>
              <dt>How to see it</dt>
              <dd>${escapeHtml(entry.howToSee)}</dd>
            </div>
            <div>
              <dt>Public display</dt>
              <dd>${escapeHtml(entry.expositionInfo)}</dd>
            </div>
            <div>
              <dt>Source set</dt>
              <dd>${escapeHtml(entry.sourceLabel)}</dd>
            </div>
          </dl>
          <div class="record-actions">
            <button class="button button-secondary relic-action" type="button" data-id="${escapeHtml(entry.id)}">
              More details
            </button>
            ${
              entry.sourceUrl
                ? `<a class="text-link" href="${escapeHtml(entry.sourceUrl)}" target="_blank" rel="noreferrer">Open source</a>`
                : ""
            }
          </div>
        </article>
      `
    )
    .join("");
}

function renderSourceGrid() {
  if (!sourceGrid) {
    return;
  }

  const sources = Array.isArray(atlasGuide.sourceCatalog) ? atlasGuide.sourceCatalog : [];

  sourceGrid.innerHTML = sources
    .map((source) => {
      const count = guideRelics.filter((entry) => entry.sourceKey === source.key).length;

      return `
        <article class="source-card reveal">
          <div class="card-topline">
            <span class="pill">${escapeHtml(pluralize(count, "record"))}</span>
          </div>
          <h3>${escapeHtml(source.title)}</h3>
          <p>${escapeHtml(source.note || "")}</p>
          <a class="text-link" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">Open source</a>
        </article>
      `;
    })
    .join("");
}

function renderFooterColumns() {
  if (!footerColumnsEl) {
    return;
  }

  footerColumnsEl.innerHTML = (atlasGuide.footerColumns || [])
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

function openDetail(entry) {
  if (!detailOverlay || !detailContent) {
    return;
  }

  detailContent.innerHTML = `
    <p class="eyebrow">${escapeHtml(entry.city)}, ${escapeHtml(entry.country)}</p>
    <h2 id="detail-title">${escapeHtml(entry.relicName)}</h2>
    <div class="detail-pills">
      <span class="class-pill ${escapeHtml(entry.classType)}">${escapeHtml(entry.classLabel)}</span>
      <span class="pill">${escapeHtml(entry.institutionType)}</span>
      <span class="pill">${escapeHtml(entry.accessLabel)}</span>
    </div>
    <p class="detail-shrine">${escapeHtml(entry.shrine)}</p>
    <p>${escapeHtml(entry.summary)}</p>
    <div class="detail-block">
      <h3>Where it is kept</h3>
      <p>${escapeHtml(entry.whereLocated)}</p>
    </div>
    <div class="detail-block">
      <h3>How to see it</h3>
      <p>${escapeHtml(entry.howToSee)}</p>
    </div>
    <div class="detail-block">
      <h3>Public display and exposition</h3>
      <p>${escapeHtml(entry.expositionInfo)}</p>
    </div>
    <div class="detail-block">
      <h3>Source record</h3>
      <p>${escapeHtml(entry.sourceLabel)}</p>
      ${
        entry.sourceItemText
          ? `<p class="detail-note">${escapeHtml(entry.sourceItemText)}</p>`
          : entry.notes
            ? `<p class="detail-note">${escapeHtml(entry.notes)}</p>`
            : ""
      }
    </div>
    ${
      entry.sourceUrl
        ? `<a class="button button-primary" href="${escapeHtml(entry.sourceUrl)}" target="_blank" rel="noreferrer">Open source</a>`
        : ""
    }
  `;

  detailOverlay.hidden = false;
  document.body.classList.add("modal-open");
}

function closeDetail() {
  if (!detailOverlay) {
    return;
  }

  detailOverlay.hidden = true;
  document.body.classList.remove("modal-open");
}

function syncControls(state) {
  if (queryInput) {
    queryInput.value = state.query;
  }
  if (classFilter) {
    classFilter.value = state.classType;
  }
  if (accessFilter) {
    accessFilter.value = state.accessType;
  }
  if (routeFilter) {
    routeFilter.value = state.route;
  }
}

function getStateFromControls() {
  return {
    query: queryInput ? queryInput.value.trim() : "",
    classType: classFilter ? classFilter.value : "all",
    accessType: accessFilter ? accessFilter.value : "all",
    route: routeFilter ? routeFilter.value : "all",
  };
}

function render(state) {
  syncControls(state);
  updateUrl(state);

  const filtered = filterRelics(state);
  summarize(filtered, state);
  renderCityGuides(filtered);
  renderRelics(filtered);
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

if (filterForm) {
  filterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    render(getStateFromControls());
  });
}

if (resetFilters) {
  resetFilters.addEventListener("click", () => {
    render({
      query: "",
      classType: "all",
      accessType: "all",
      route: "all",
    });
  });
}

if (quickCityChips) {
  quickCityChips.addEventListener("click", (event) => {
    const button = event.target.closest("[data-city]");
    if (!button) {
      return;
    }

    render({
      query: button.dataset.city || "",
      classType: classFilter ? classFilter.value : "all",
      accessType: accessFilter ? accessFilter.value : "all",
      route: routeFilter ? routeFilter.value : "all",
    });
  });
}

if (cityGuideGrid) {
  cityGuideGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-city]");
    if (!button) {
      return;
    }

    render({
      query: button.dataset.city || "",
      classType: classFilter ? classFilter.value : "all",
      accessType: accessFilter ? accessFilter.value : "all",
      route: routeFilter ? routeFilter.value : "all",
    });
  });
}

if (relicGrid) {
  relicGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-id]");
    if (!button) {
      return;
    }

    const entry = guideRelics.find((relic) => relic.id === button.dataset.id);
    if (entry) {
      openDetail(entry);
    }
  });
}

if (detailClose) {
  detailClose.addEventListener("click", closeDetail);
}

if (detailOverlay) {
  detailOverlay.addEventListener("click", (event) => {
    if (event.target === detailOverlay) {
      closeDetail();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && detailOverlay && !detailOverlay.hidden) {
    closeDetail();
  }
});

populateAccessOptions();
populateRouteOptions();
renderQuickCities();
renderSourceGrid();
renderFooterColumns();
setDirectoryMeta();
render(getStateFromUrl());
setupNewsletter();
setupReveal();
