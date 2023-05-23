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
    await fetchMovies(
      `?genre=${category}&page=${page}&sort_by=-imdb_score`
    ).then((data) => {
      fetchedMovies.push(data.results);
    });
  }

  return fetchedMovies;
};

const createBestMovieCategory = async () => {
  const fetchedBestMovies = await fetchMovies("?sort_by=-imdb_score");
  const bestMovie = fetchedBestMovies.results[0];
  const imgNode = document.createElement("img");
  imgNode.setAttribute("src", bestMovie.image_url);
  document.getElementById("best-movie-cover").appendChild(imgNode);
  document.getElementById("best-movie-title").textContent = bestMovie.title;
};

const createMovieCategory = async (category) => {
  const categoryTitle =
    category.toString().charAt(0).toUpperCase() + category.slice(1);
  const movies = await fetchMoviesCategory(category);

  const categoryNode = document.createElement("div");
  categoryNode.className = `movie-category`;
  categoryNode.id = `movie-category-${category}`;
  document.getElementById("movie-categories").appendChild(categoryNode);

  const titleNode = document.createElement("h1");
  titleNode.innerHTML = categoryTitle;
  titleNode.id = "movie-category-title";
  document.getElementById(`movie-category-${category}`).appendChild(titleNode);

  createCarousel(movies, category);
};

const createMovieComponent = (movie) => {
  const movieNode = document.createElement("article");
  const imgNode = document.createElement("img");
  imgNode.setAttribute("src", movie.image_url);
  movieNode.appendChild(imgNode);
  return movieNode;
};

const createCarousel = async (movies, category) => {
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

window.addEventListener("load", () => {
  createBestMovieCategory();
  createMovieCategory("romance");
  createMovieCategory("drama");
  createMovieCategory("family");
});
