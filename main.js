const fetchMovies = async (filter) => {
  return await fetch(`http://localhost:8000/api/v1/titles/${filter}`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .catch((error) => console.error(error));
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
  const fetchedMovies = await fetchMovies(`?genre=${category}`);
  const movies = fetchedMovies.results;

  const categoryNode = document.createElement("div");
  categoryNode.id = "movie-category";

  for (let i = 0; i < movies.length; i++) {
    categoryNode.appendChild(createMovieComponent(movies[i]));
  }

  document.getElementById("movie-categories").appendChild(categoryNode);
  document.getElementById("movie-categories").appendChild(categoryNode);
};

const createMovieComponent = (movie) => {
  const movieNode = document.createElement("article");
  const imgNode = document.createElement("img");
  imgNode.setAttribute("src", movie.image_url);
  movieNode.appendChild(imgNode);
  return movieNode;
};

window.addEventListener("load", () => {
  createBestMovieCategory();
  createMovieCategory("horror");
  createMovieCategory("fantasy");
  createMovieCategory("romance");
});
