const genreUrl = "https://deezerdevs-deezer.p.rapidapi.com/genre";
const searchUrl = "https://deezerdevs-deezer.p.rapidapi.com/search";

const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "cb4cea1f5fmsh43d97be6eba90afp1bdc95jsnd23643164856",
    "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  },
};

const genreColors = {
  Pop: "#1DB954",
  Rock: "#FF5722",
  Jazz: "#3F51B5",
  // Aggiungi altri generi e colori qui se vuoi
};

function getGenreColor(genreName) {
  return genreColors[genreName] || "#333";
}

let categories = [];
let searchResults = [];

function randomColor() {
  const colors = ["#1DB954", "#FF5722", "#3F51B5", "#E91E63", "#009688", "#9C27B0", "#FFC107"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function renderCategoriesOrResults(filter = "") {
  const grid = document.getElementById("categoryGrid");
  const dataToRender = filter ? searchResults : categories;

  const filtered = dataToRender.filter((item) => item.title?.toLowerCase().includes(filter.toLowerCase()));

  renderResults(filtered, grid);
}

async function fetchCategories() {
  const grid = document.getElementById("categoryGrid");
  showLoading(grid);

  try {
    const res = await fetch(genreUrl, options);
    if (!res.ok) {
      console.error("Errore nella risposta API:", res.status, res.statusText);
      return;
    }
    const data = await res.json();

    categories = data.data.map((genre) => ({
      title: genre.name,
      color: getGenreColor(genre.name),
      img: genre.picture,
    }));

    renderResults(categories, grid);
  } catch (err) {
    console.error("Errore durante la chiamata API Deezer:", err);
    grid.innerHTML = `<p class="text-danger">Impossibile caricare i generi musicali. Riprova più tardi.</p>`;
  }
}

async function fetchSearchResults(query) {
  try {
    const res = await fetch(`${searchUrl}?q=${encodeURIComponent(query)}&timestamp=${Date.now()}`, options);
    if (!res.ok) {
      console.error("Errore nella risposta API:", res.status, res.statusText);
      return;
    }
    const data = await res.json();

    console.log("Dati ricevuti per la ricerca:", data);

    searchResults = data.data.map((item) => ({
      title: item.title || item.name,
      img: item.album?.cover || item.picture || "https://via.placeholder.com/150",
    }));

    renderSearchResults(query);
  } catch (err) {
    console.error("Errore durante la ricerca:", err);
    const grid = document.getElementById("categoryGrid");
    grid.innerHTML = `<p class="text-danger">Impossibile completare la ricerca. Riprova più tardi.</p>`;
  }
}

function renderSearchResults(filter = "") {
  const grid = document.getElementById("categoryGrid");
  grid.innerHTML = "";

  const filtered = searchResults.filter((item) => (item.title || "").toLowerCase().includes(filter.toLowerCase()));

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="text-primary">Nessun risultato trovato.</p>`;
    return;
  }

  filtered.forEach((item) => {
    const col = document.createElement("div");
    col.className = "col-6 col-md-4 col-lg-3 mb-4";
    col.innerHTML = `
      <div class="card h-100 text-white border-0" style="background-color: #333;">
        <img src="${item.img}" class="card-img-top rounded" alt="${item.title}">
        <div class="card-body d-flex align-items-center justify-content-center">
          <h5 class="card-title text-center">${item.title}</h5>
        </div>
      </div>
    `;
    grid.appendChild(col);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const genreToggle = document.getElementById("genre-toggle");
  const searchPanel = document.getElementById("search-panel");
  const middleColumn = document.getElementById("middle-column");
  const searchInput = document.getElementById("searchInput");

  if (!genreToggle || !searchPanel || !middleColumn) {
    console.error("Elemento mancante nel DOM.");
    return;
  }

  genreToggle.addEventListener("click", () => {
    middleColumn.classList.add("d-none");
    searchPanel.classList.remove("d-none");
    searchInput.value = "";
    fetchCategories();
  });

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim();
      if (query) {
        fetchSearchResults(query);
      } else {
        renderCategoriesOrResults();
      }
    });
  }

  fetchCategories();
});

function showLoading(grid) {
  grid.innerHTML = `<div class="text-center"><div class="spinner-border text-light" role="status"></div></div>`;
}

function renderResults(data, grid) {
  console.log("Sto renderizzando questi dati:", data);
  grid.innerHTML = "";

  if (data.length === 0) {
    grid.innerHTML = `<p class="text-success">Nessun risultato trovato.</p>`;
    return;
  }

  /* ----- */
}

async function fetchSearchResults(query) {
  try {
    const res = await fetch(`${searchUrl}?q=${encodeURIComponent(query)}&timestamp=${Date.now()}`, options);
    if (!res.ok) {
      console.error("Errore nella risposta API:", res.status, res.statusText);
      return;
    }
    const data = await res.json();

    console.log("Dati ricevuti per la ricerca:", data);

    searchResults = data.data.map((item) => ({
      title: item.title,
      artist: item.artist?.name,
      album: item.album?.title,
      img: item.album?.cover || item.picture || "https://via.placeholder.com/150",
      duration: item.duration,
      link: item.link,
    }));

    renderSearchResults(query);
  } catch (err) {
    console.error("Errore durante la ricerca:", err);
    const grid = document.getElementById("categoryGrid");
    grid.innerHTML = `<p class="text-danger">Impossibile completare la ricerca. Riprova più tardi.</p>`;
  }
}

function renderSearchResults(filter = "") {
  const grid = document.getElementById("categoryGrid");
  grid.innerHTML = "";

  const filtered = searchResults.filter((item) => (item.title || "").toLowerCase().includes(filter.toLowerCase()));

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="text-warning">Nessun risultato trovato.</p>`;
    return;
  }

  const listGroup = document.createElement("ul");
  listGroup.className = "list-group w-100";

  filtered.forEach((item) => {
    const durationMin = Math.floor(item.duration / 60);
    const durationSec = item.duration % 60;

    const li = document.createElement("li");
    li.className = "list-group-item d-flex align-items-center gap-3";

    li.innerHTML = `
      <img src="${item.img}" alt="${item.title}" class="rounded" style="width: 80px; height: 80px; object-fit: cover;">
      <div class="flex-grow-1">
        <h5 class="mb-1">${item.title}</h5>
        <p class="mb-0 text-muted"> ${item.artist} | ${item.album}</p>
        <p class="mb-0 text-muted"> ${durationMin}:${durationSec.toString().padStart(2, "0")}</p>
        <a href="${item.link}" target="_blank" class="btn btn-sm btn-outline-primary mt-1">Ascolta su Deezer</a>
      </div>
    `;

    listGroup.appendChild(li);
  });

  grid.appendChild(listGroup);
}
