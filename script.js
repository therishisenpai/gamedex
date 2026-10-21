const GAMES = [
  {id:1,title:"Elden Ring",genre:"RPG",platform:"PC / Console",year:2022,studio:"FromSoftware",tag:"DARK FANTASY",c1:"#9a7a48",c2:"#27251c",art:"ELDEN RING",desc:"Explore the Lands Between in a vast dark-fantasy action RPG."},
  {id:2,title:"Cyberpunk 2077",genre:"RPG",platform:"PC / Console",year:2020,studio:"CD Projekt Red",tag:"OPEN WORLD",c1:"#e6b42f",c2:"#7c3d45",art:"CYBERPUNK",desc:"Build your legend in the neon-lit streets of Night City."},
  {id:3,title:"God of War Ragnarök",genre:"Action",platform:"PC / Console",year:2022,studio:"Santa Monica Studio",tag:"MYTHOLOGY",c1:"#4c8390",c2:"#253246",art:"GOD OF WAR",desc:"Journey through the Nine Realms with Kratos and Atreus."},
  {id:4,title:"Persona 5 Royal",genre:"RPG",platform:"PC / Console",year:2019,studio:"Atlus",tag:"STYLE / RPG",c1:"#d84142",c2:"#471d34",art:"PERSONA 5",desc:"Live a double life and change the hearts of corrupt adults."},
  {id:5,title:"Hades",genre:"Action",platform:"PC / Console",year:2020,studio:"Supergiant Games",tag:"ROGUELIKE",c1:"#ed9a46",c2:"#762f40",art:"HADES",desc:"Fight your way out of the Underworld in this fast roguelike."},
  {id:6,title:"The Legend of Zelda: BOTW",genre:"Adventure",platform:"Nintendo",year:2017,studio:"Nintendo",tag:"ADVENTURE",c1:"#d8bd7b",c2:"#416c63",art:"BREATH OF THE WILD",desc:"Discover a vast kingdom and define your own adventure."},
  {id:7,title:"Baldur's Gate 3",genre:"RPG",platform:"PC / Console",year:2023,studio:"Larian Studios",tag:"CHOICES MATTER",c1:"#9d8cbd",c2:"#362f50",art:"BALDUR'S GATE 3",desc:"Gather your party and shape a story through meaningful choices."},
  {id:8,title:"Resident Evil 4",genre:"Action",platform:"PC / Console",year:2023,studio:"Capcom",tag:"SURVIVAL HORROR",c1:"#9f9273",c2:"#26352e",art:"RESIDENT EVIL 4",desc:"Survive a terrifying rescue mission in a reimagined horror classic."},
  {id:9,title:"Stardew Valley",genre:"Adventure",platform:"PC / Console",year:2016,studio:"ConcernedApe",tag:"COZY LIFE",c1:"#9cbe78",c2:"#3c7059",art:"STARDEW VALLEY",desc:"Build a new life, grow crops, make friends, and explore."},
  {id:10,title:"Civilization VI",genre:"Strategy",platform:"PC / Console",year:2016,studio:"Firaxis Games",tag:"4X STRATEGY",c1:"#d1ad73",c2:"#65503b",art:"CIVILIZATION VI",desc:"Build an empire that stands the test of time."},
  {id:11,title:"Sekiro: Shadows Die Twice",genre:"Action",platform:"PC / Console",year:2019,studio:"FromSoftware",tag:"PRECISION COMBAT",c1:"#b58b5d",c2:"#34303a",art:"SEKIRO",desc:"Carve a path through a brutal reimagining of Sengoku Japan."},
  {id:12,title:"Final Fantasy VII Rebirth",genre:"RPG",platform:"PlayStation",year:2024,studio:"Square Enix",tag:"EPIC RPG",c1:"#8bc1d5",c2:"#34415f",art:"FINAL FANTASY VII",desc:"Continue an epic journey across a beautiful, dangerous world."}
];

// DOM ELEMENTS
const catalogSection = document.querySelector("#catalog");
const statsSection = document.querySelector("#statsView");
const search = document.querySelector("#search");
const genreSelect = document.querySelector("#genre");

const sLibrary = document.querySelector("#sLibrary");
const sCompleted = document.querySelector("#sCompleted");
const sHours = document.querySelector("#sHours");
const sWishlist = document.querySelector("#sWishlist");

const crumb = document.querySelector("#crumb");
const grid = document.querySelector("#grid");
const empty = document.querySelector("#empty");
const filters = document.querySelector("#filters");
const tools = document.querySelector("#tools");
const eyebrow = document.querySelector("#eyebrow");
const title = document.querySelector("#title");

const breakdown = document.querySelector("#breakdown");
const summary = document.querySelector("#summary");
const dialogbody = document.querySelector("#dialogbody");
const dialog = document.querySelector("#dialog");
const reset = document.querySelector("#reset");

const KEY = "gamedex-demo-v1";
const blank = () => ({
  library: {},
  wishlist: [],
  reviews: {}
});

let state = load();
let view = "discover";
let genre = "all";
let toastTimer;

// STORAGE
function load() {
  try {
    return {
      ...blank(),
      ...JSON.parse(localStorage.getItem(KEY) || "{}")
    };
  } catch (error) {
    return blank();
  }
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
  stats();
}

// HELPERS
function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function game(id) {
  return GAMES.find(g => g.id === Number(id));
}

function toast(message) {
  const element = document.querySelector("#toast");
  element.textContent = message;
  element.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    element.classList.remove("show");
  }, 2300);
}

// TOP DASHBOARD STATISTICS
function stats() {
  const library = Object.values(state.library);

  sLibrary.textContent = library.length;
  sCompleted.textContent =
    library.filter(g => g.status === "Completed").length;

  sHours.textContent =
    library.reduce((total, g) => total + (+g.hours || 0), 0) + "h";

  sWishlist.textContent = state.wishlist.length;
}

// GAME CARD
function card(g) {
  const entry = state.library[g.id];
  const wished = state.wishlist.includes(g.id);

  return `
    <article class="card">
      <div class="cover" style="--c1:${g.c1};--c2:${g.c2}">
        <span class="cover-badge">${esc(g.tag)}</span>
        <span class="cover-year">${g.year}</span>
        <div class="cover-art">
          ${esc(g.art)}
          <small>${g.genre.toUpperCase()}</small>
        </div>
      </div>

      <div class="body">
        <div class="meta">
          <span>${esc(g.genre)}</span>
          <span>${esc(g.platform)}</span>
        </div>

        <h3 class="game-title" title="${esc(g.title)}">
          ${esc(g.title)}
        </h3>

        <div class="desc">${esc(g.desc)}</div>

        <div class="actions">
          <button
            class="small ${entry ? "in-library" : ""}"
            data-action="library"
            data-id="${g.id}">
            ${entry ? "✓ " + esc(entry.status) : "+ Add to library"}
          </button>

          <button
            class="small secondary"
            data-action="wishlist"
            data-id="${g.id}"
            aria-label="Toggle wishlist">
            ${wished ? "♥" : "♡"}
          </button>

          <button
            class="small secondary"
            data-action="details"
            data-id="${g.id}"
            aria-label="Game details">
            ···
          </button>
        </div>
      </div>
    </article>
  `;
}

// CATALOG AND FILTERING
function catalog() {
  const query = search.value.trim().toLowerCase();
  const selectedGenre = genreSelect.value;

  const list = GAMES.filter(g =>
    (view !== "library" || !!state.library[g.id]) &&
    (view !== "wishlist" || state.wishlist.includes(g.id)) &&
    (selectedGenre === "all" || g.genre === selectedGenre) &&
    (genre === "all" || g.genre === genre) &&
    `${g.title} ${g.genre} ${g.studio} ${g.platform}`
      .toLowerCase()
      .includes(query)
  );

  grid.innerHTML = list.map(card).join("");

  empty.classList.toggle("hidden", list.length > 0);
  filters.classList.toggle("hidden", view !== "discover");
  tools.classList.toggle("hidden", view === "stats");
}

// STATS PAGE
function statsView() {
  const library = Object.values(state.library);
  const statuses = ["Backlog", "Playing", "Paused", "Completed"];
  const total = library.length || 1;

  breakdown.innerHTML = statuses.map(status => {
    const count = library.filter(
      entry => entry.status === status
    ).length;

    return `
      <div class="break-row">
        <span>${status}</span>
        <div class="bar">
          <span style="width:${count / total * 100}%"></span>
        </div>
        <strong>${count}</strong>
      </div>
    `;
  }).join("");

  const hours = library.reduce(
    (totalHours, entry) => totalHours + (+entry.hours || 0),
    0
  );

  const reviews = Object.values(state.reviews)
    .filter(review => +review.rating > 0);

  const average = reviews.length
    ? (
        reviews.reduce(
          (totalRating, review) => totalRating + (+review.rating),
          0
        ) / reviews.length
      ).toFixed(1)
    : "N/A";

  summary.innerHTML = `
    <div class="summary-item">
      <span>Games in library</span>
      <strong>${library.length}</strong>
    </div>

    <div class="summary-item">
      <span>Games completed</span>
      <strong>${library.filter(g => g.status === "Completed").length}</strong>
    </div>

    <div class="summary-item">
      <span>Total hours tracked</span>
      <strong>${hours}h</strong>
    </div>

    <div class="summary-item">
      <span>Wishlist items</span>
      <strong>${state.wishlist.length}</strong>
    </div>

    <div class="summary-item">
      <span>Games reviewed</span>
      <strong>${reviews.length}</strong>
    </div>

    <div class="summary-item">
      <span>Average rating</span>
      <strong>${average}${average === "N/A" ? "" : "/5"}</strong>
    </div>
  `;
}

// NAVIGATION
function setView(newView) {
  view = newView;

  document.querySelectorAll("[data-view]").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.view === newView
    );
  });

  crumb.textContent = newView.toUpperCase();

  catalogSection.classList.toggle("hidden", newView === "stats");
  statsSection.classList.toggle("hidden", newView !== "stats");

  const headings = {
    discover: ["THE CATALOG", "Discover games"],
    library: ["YOUR COLLECTION", "My library"],
    wishlist: ["SAVED FOR LATER", "Wishlist"]
  };

  if (newView !== "stats") {
    eyebrow.textContent = headings[newView][0];
    title.textContent = headings[newView][1];

    search.value = "";
    genreSelect.value = "all";
    genre = "all";

    document.querySelectorAll("[data-filter]").forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.filter === "all"
      );
    });
  } else {
    statsView();
  }

  catalog();
}

// GAME DETAILS DIALOG
function details(id) {
  const g = game(id);
  if (!g) return;

  const entry = state.library[g.id] || {
    status: "Backlog",
    hours: 0,
    progress: 0
  };

  const review = state.reviews[g.id] || {
    rating: 0,
    comment: ""
  };

  dialogbody.innerHTML = `
    <div
      class="dialog-cover"
      style="background:linear-gradient(135deg,${g.c1},${g.c2})">
      ${esc(g.art)}
    </div>

    <h2 class="dialog-title">${esc(g.title)}</h2>

    <div class="meta">
      <span>${esc(g.genre)} · ${g.year}</span>
      <span>${esc(g.studio)}</span>
    </div>

    <p class="dialog-desc">${esc(g.desc)}</p>

    <form id="gameForm">
      <div class="form-grid">

        <label class="field">
          Library status
          <select name="status">
            <option ${entry.status === "Backlog" ? "selected" : ""}>Backlog</option>
            <option ${entry.status === "Playing" ? "selected" : ""}>Playing</option>
            <option ${entry.status === "Paused" ? "selected" : ""}>Paused</option>
            <option ${entry.status === "Completed" ? "selected" : ""}>Completed</option>
          </select>
        </label>

        <label class="field">
          Hours played
          <input
            name="hours"
            type="number"
            min="0"
            max="99999"
            value="${+entry.hours || 0}">
        </label>

        <label class="field full">
          Progress (%)
          <input
            name="progress"
            type="number"
            min="0"
            max="100"
            value="${+entry.progress || 0}">
        </label>

        <label class="field">
          Your rating
          <select name="rating">
            <option value="0">Not rated</option>
            ${[1, 2, 3, 4, 5].map(n => `
              <option
                value="${n}"
                ${+review.rating === n ? "selected" : ""}>
                ${n} / 5
              </option>
            `).join("")}
          </select>
        </label>

        <label class="field full">
          Review / notes
          <textarea
            name="comment"
            maxlength="500"
            placeholder="What did you think?">${esc(review.comment || "")}</textarea>
        </label>

      </div>

      <div class="dialog-actions">
        <button type="button" class="small secondary" id="remove">
          Remove from library
        </button>
        <button class="primary">Save changes ✓</button>
      </div>
    </form>
  `;

  document.querySelector("#gameForm").addEventListener("submit", event => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const status = form.get("status");

    state.library[g.id] = {
      status,
      hours: Math.max(0, +form.get("hours") || 0),
      progress: status === "Completed"
        ? 100
        : Math.min(100, Math.max(0, +form.get("progress") || 0))
    };

    state.reviews[g.id] = {
      rating: +form.get("rating") || 0,
      comment: String(form.get("comment") || "").trim()
    };

    save();
    dialog.close();
    catalog();

    if (view === "stats") statsView();

    toast("Saved " + g.title + " to your GameDex.");
  });

  document.querySelector("#remove").addEventListener("click", () => {
    delete state.library[g.id];

    save();
    dialog.close();
    catalog();

    toast("Removed from your library.");
  });

  dialog.showModal();
}

// BUTTON ACTIONS
function action(actionName, id) {
  const g = game(id);
  if (!g) return;

  if (actionName === "library") {
    if (state.library[id]) {
      details(id);
    } else {
      state.library[id] = {
        status: "Backlog",
        hours: 0,
        progress: 0
      };

      save();
      catalog();
      toast(g.title + " added to your library.");
    }
  }

  if (actionName === "wishlist") {
    if (state.wishlist.includes(+id)) {
      state.wishlist = state.wishlist.filter(
        gameId => gameId !== +id
      );

      toast("Removed from wishlist.");
    } else {
      state.wishlist.push(+id);
      toast(g.title + " added to your wishlist.");
    }

    save();
    catalog();
  }

  if (actionName === "details") {
    details(id);
  }
}

// GENERAL CLICK HANDLER
document.addEventListener("click", event => {
  const viewButton = event.target.closest("[data-view]");

  if (viewButton) {
    setView(viewButton.dataset.view);
    return;
  }

  const jumpButton = event.target.closest("[data-jump]");

  if (jumpButton) {
    setView(jumpButton.dataset.jump);
    return;
  }

  const filterButton = event.target.closest("[data-filter]");

  if (filterButton) {
    genre = filterButton.dataset.filter;
    genreSelect.value = genre;

    document.querySelectorAll("[data-filter]").forEach(button => {
      button.classList.toggle("active", button === filterButton);
    });

    catalog();
    return;
  }

  const actionButton = event.target.closest("[data-action]");

  if (actionButton) {
    action(actionButton.dataset.action, +actionButton.dataset.id);
  }
});

// SEARCH AND GENRE DROPDOWN
search.addEventListener("input", catalog);

genreSelect.addEventListener("change", () => {
  genre = "all";

  document.querySelectorAll("[data-filter]").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.filter === "all"
    );
  });

  catalog();
});

// RESET DEMO DATA BUTTON
reset.addEventListener("click", () => {
  if (confirm("Reset all GameDex demo data in this browser?")) {
    state = blank();

    save();
    setView("discover");
    toast("Demo data reset.");
  }
});

// INITIALIZE GENRES AND APP
[...new Set(GAMES.map(g => g.genre))].forEach(g => {
  genreSelect.add(new Option(g, g));
});

stats();
setView("discover");
