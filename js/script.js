const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

async function fetchMovies(category = 'popular') {
    try {
        const response = await axios.get(`${BASE_URL}/movie/${category}?api_key=${API_KEY}`);
        const movies = response.data.results;
        displayMovies(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

function displayMovies(movies) {
    const movieGrid = document.getElementById('movieGrid');
    movieGrid.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
          <img src="${IMG_URL + movie.poster_path}" alt="${movie.title} poster" class="movie-poster" data-movie-id="${movie.id}">
          <div class="movie-info">
            <div class="movie-title">${movie.title}</div>
            <div class="movie-rating">
              <svg class="star-icon" viewBox="0 0 24 24">
                <path fill="#ffd700" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
              ${movie.vote_average.toFixed(1)}
            </div>
          </div>
        `;
        movieGrid.appendChild(movieCard);

        const poster = movieCard.querySelector('.movie-poster');
        poster.addEventListener('click', () => {
            const movieId = poster.getAttribute('data-movie-id');
            openTrailerModal(movieId);
        });
    });
}

const categoryButtons = document.querySelectorAll('.category-button');
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        fetchMovies(button.dataset.category);
    });
});

const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');

async function searchMovies(query) {
    try {
        const response = await axios.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
        const movies = response.data.results;
        displayMovies(movies);
    } catch (error) {
        console.error('Error searching movies:', error);
    }
}

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchMovies(query);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            searchMovies(query);
        }
    }
});

const modal = document.getElementById('trailerModal');
const closeBtn = document.querySelector('.close');
const trailerContainer = document.getElementById('trailerContainer');

async function openTrailerModal(movieId) {
    try {
        const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
        const videos = response.data.results;
        const trailer = videos.find(video => video.type === 'Trailer' || video.type === 'Bande-annonce') || videos[0];

        if (trailer) {
            trailerContainer.innerHTML = `
            <iframe width="100%" height="500" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>
          `;
            modal.style.display = 'block';
        } else {
            alert('No trailer available for this movie.');
        }
    } catch (error) {
        console.error('Error fetching trailer:', error);
        alert('Failed to load the trailer. Please try again later.');
    }
}

closeBtn.onclick = function () {
    modal.style.display = 'none';
    trailerContainer.innerHTML = '';
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
        trailerContainer.innerHTML = '';
    }
}

fetchMovies();