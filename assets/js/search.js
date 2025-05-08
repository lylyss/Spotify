/*  sezione di ricerca e nasconde il contenuto centrale */
document.getElementById("open-search").addEventListener("click", () => {
  document.getElementById("middle-column").classList.add("d-none");
  document.getElementById("search-results").classList.remove("d-none");
  renderCategories();
});

/* Ricerca */
async function searchDeezer(query) {
  const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "cb4cea1f5fmsh43d97be6eba90afp1bdc95jsnd23643164856",
      "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    const resultsContainer = document.getElementById("results-container");
    resultsContainer.innerHTML = ""; /* elimnina risultati precedenti */

    data.data.forEach((track) => {
      const card = `
        <div class="col-md-3 mb-4">
          <div class="card h-100">
            <img src="${track.album.cover_medium}" class="card-img-top" alt="${track.title}">
            <div class="card-body">
              <h5 class="card-title">${track.title}</h5>
              <p class="card-text">${track.artist.name}</p>
            </div>
          </div>
        </div>
      `;
      resultsContainer.innerHTML += card;
    });
  } catch (error) {
    console.error(error);
  }
}

/* avvia la ricerca al click sul bottone */
document.getElementById("search-button").addEventListener("click", () => {
  const query = document.getElementById("search-input").value.trim();
  if (query) {
    searchDeezer(query);
  }
});

const categories = [
  {
    title: "Music",
    color: "#e1337c",
    img: "URL_IMMAGINE_MUSIC",
  },
  {
    title: "Podcasts",
    color: "#1db954",
    img: "URL_IMMAGINE_PODCASTS",
  },
  {
    title: "Live Events",
    color: "#a259e6",
    img: "URL_IMMAGINE_LIVE",
  },
  {
    title: "Made for you",
    color: "#1e3264",
    img: "URL_IMMAGINE_LIVE",
  },
  {
    title: "New Releases",
    color: "#608108",
    img: "URL_IMMAGINE_LIVE",
  },
  {
    title: "Sanremo Festival",
    color: "#477d95",
    img: "URL_IMMAGINE_LIVE",
  },
  {
    title: "Latin",
    color: "#0d72ea",
    img: "URL_IMMAGINE_LIVE",
  },
  {
    title: "Pop",
    color: "#477d95",
    img: "URL_IMMAGINE_LIVE",
  },
  {
    title: "Hip Hop",
    color: "#477d94",
    img: "URL_IMMAGINE_LIVE",
  },
  {
    title: "Podcast Charts",
    color: "#0d73ec",
    img: "URL_IMMAGINE_LIVE",
  },
  {
    title: "Podcast New ",
    color: "#8e66ac",
    img: "URL_IMMAGINE_LIVE",
  },
  {
    title: "Video Podcasts",
    color: "#608108",
    img: "URL_IMMAGINE_LIVE",
  },
  {
    title: "Charts",
    color: "#8d67ab",
    img: "URL_IMMAGINE_LIVE",
  },
  {
    title: "Dance/Electronic",
    color: "#0d73ec",
    img: "URL_IMMAGINE_LIVE",
  },
  {
    title: "Rock",
    color: "#006450",
    img: "URL_IMMAGINE_LIVE",
  },
  {
    title: "Indie",
    color: "#e91429",
    img: "URL_IMMAGINE_LIVE",
  },
];

async function renderCategories() {
  const resultsContainer = document.getElementById("results-container");
  resultsContainer.innerHTML = "";

  for (const cat of categories) {
    try {
      const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(cat.title)}`;
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key": "cb4cea1f5fmsh43d97be6eba90afp1bdc95jsnd23643164856",
          "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
        },
      };

      const response = await fetch(url, options);
      const data = await response.json();

      /* un'immagine casuale */
      let randomImg = cat.img;
      if (data.data && data.data.length > 0) {
        const randomTrack = data.data[Math.floor(Math.random() * data.data.length)];
        randomImg = randomTrack.album.cover_medium;
      }

      const card = `
        <div class="col-6 col-md-4 col-lg-3 mb-4 ">
          <div class="card h-100 text-white border-0 category-card runded-0" 
               style="background-color: ${cat.color}; min-height: 120px; cursor:pointer;"
               data-category="${cat.title}">
            <div class="d-flex flex-column justify-content-between h-100 p-3">
              <h5 class="card-title">${cat.title}</h5>
              <img src="${randomImg}" class="img-fluid rounded-0" alt="${cat.title}">
            </div>
          </div>
        </div>
      `;
      resultsContainer.innerHTML += card;
    } catch (error) {
      console.error(`Errore nel caricamento della categoria ${cat.title}:`, error);
    }
  }

  /* card cliccabili */
  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", function () {
      const category = this.getAttribute("data-category");
      searchDeezer(category);
    });
  });
}
