const fetchMovies = async (filter) => {
  return await fetch(`http://localhost:8000/api/v1/titles/${filter}`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .catch((error) => console.error(error));
};

const fetchMoviesCategory = async (category) => {
  const fetchedMovies = [];

  // Retrieve the first two pages of movies in the chosen category sorted by best rated
  for (let page = 1, maxPage = 2; page <= maxPage; page++) {
    await fetchMovies(`?genre=${category}&page=${page}&sort_by=-imdb_score`)
      .then((data) => {
        fetchedMovies.push(data.results);
      })
      .catch((error) => console.error(error));
  }

  return fetchedMovies;
};

const createBestMovie = async () => {
  const fetchedBestMovies = await fetchMovies("?sort_by=-imdb_score");
  const bestMovie = fetchedBestMovies.results[0];
  const bestMovieDetails = await fetchMovies(bestMovie.id);

  const imgNode = document.createElement("img");
  imgNode.setAttribute("src", bestMovie.image_url);
  document.getElementById("best-movie-cover").appendChild(imgNode);
  document.getElementById("best-movie-title").textContent = bestMovie.title;

  document.getElementById("best-movie-genre").textContent =
    bestMovieDetails.genres.join(", ");
  document.getElementById("best-movie-description").textContent =
    bestMovieDetails.description;
  document
    .getElementById("best-movie-btn")
    .addEventListener("click", () => populateModal(bestMovieDetails));
};

const createMovieCategory = async (category, name) => {
  const movies = await fetchMoviesCategory(category);

  const categoryNode = document.createElement("div");
  categoryNode.className = `movie-category`;
  categoryNode.id = `movie-category-${category}`;
  document.getElementById("movie-categories").appendChild(categoryNode);

  const titleNode = document.createElement("h1");
  titleNode.innerHTML = name;
  titleNode.id = "movie-category-title";
  document.getElementById(`movie-category-${category}`).appendChild(titleNode);

  createCarousel(movies, category);
};

const createMovieComponent = (movie) => {
  const movieNode = document.createElement("article");
  const imgNode = document.createElement("img");
  imgNode.setAttribute("src", movie.image_url);
  movieNode.appendChild(imgNode);
  movieNode.addEventListener("click", () => populateModal(movie));
  return movieNode;
};

const createCarousel = (movies, category) => {
  let carouselIndex = 0;

  const carouselContainer = document.createElement("container");
  carouselContainer.className = "carousel-container";
  document
    .getElementById(`movie-category-${category}`)
    .appendChild(carouselContainer);

  const carouselSlider = document.createElement("div");
  carouselSlider.className = "carousel-slider";
  carouselContainer.appendChild(carouselSlider);

  const showMovies = () => {
    let moviesDisplayed = movies[carouselIndex];
    for (let i = 0; i < moviesDisplayed.length; i++) {
      carouselSlider.appendChild(createMovieComponent(moviesDisplayed[i]));
    }
  };

  showMovies();

  const showPrevious = () => {
    if (carouselIndex > 0) {
      carouselIndex--;
      carouselSlider.innerHTML = "";
      showMovies();
    }
  };

  const showNext = () => {
    if (carouselIndex < 1) {
      carouselIndex++;
      carouselSlider.innerHTML = "";
      showMovies();
    }
  };

  const btnWrapper = document.createElement("div");
  btnWrapper.className = "carousel-btnWrapper";
  carouselContainer.appendChild(btnWrapper);

  const prevBtn = document.createElement("button");
  prevBtn.className = "carousel-prevBtn";
  prevBtn.innerHTML = "&lt;";
  prevBtn.addEventListener("click", showPrevious);
  btnWrapper.appendChild(prevBtn);

  const nextBtn = document.createElement("button");
  nextBtn.className = "carousel-nextBtn";
  nextBtn.innerHTML = "&gt;";
  nextBtn.addEventListener("click", showNext);
  btnWrapper.appendChild(nextBtn);
};

const populateModal = async (movie) => {
  const movieDetails = await fetchMovies(movie.id);
  document.getElementById("modal-container").style.display = "flex";

  const closeModal = () => {
    document.getElementById("modal-container").style.display = "none";
  };

  document
    .getElementById("modal-closeBtn")
    .addEventListener("click", closeModal);

  document
    .getElementById("modal-cover-img")
    .setAttribute("src", movie.image_url);

  document.getElementById("modal-details-title").innerHTML =
    movieDetails.original_title;
  document.getElementById("modal-details-genre").innerHTML =
    movieDetails.genres.join(", ");
  document.getElementById("modal-details-releaseDate").innerHTML =
    movieDetails.date_published;
  document.getElementById("modal-details-rating").innerHTML =
    movieDetails.rated;
  document.getElementById("modal-details-imdb").innerHTML =
    movieDetails.imdb_score;
  document.getElementById("modal-details-director").innerHTML =
    movieDetails.directors.join(", ");
  document.getElementById("modal-details-actors").innerHTML =
    movieDetails.actors.join(", ");
  document.getElementById("modal-details-length").innerHTML =
    movieDetails.duration + "min";
  document.getElementById("modal-details-country").innerHTML =
    movieDetails.countries.join(", ");
  document.getElementById("modal-details-boxOffice").innerHTML =
    movieDetails.worldwide_gross_income &&
    `$${movieDetails.worldwide_gross_income}`;
  document.getElementById("modal-details-description").innerHTML =
    movieDetails.long_description;
};

window.addEventListener("load", async () => {
  await createBestMovie();
  await createMovieCategory("", "Best rated movies");
  createMovieCategory("romance", "Romance");
  createMovieCategory("drama", "Drama");
  createMovieCategory("family", "Family");
});
