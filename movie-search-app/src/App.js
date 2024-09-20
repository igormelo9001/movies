import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Supondo que o arquivo de estilo esteja aqui

const API_KEY = '109032215a5eecab23738be301fcf9cb2';

// Componente para renderizar um cartão de filme
const MovieCard = ({ movie }) => (
  <div className="movie-card" key={movie.imdbID}>
    <img src={movie.Poster !== "N/A" ? movie.Poster : 'placeholder.jpg'} alt={movie.Title} />
    <h2>{movie.Title}</h2>
    <p>Ano: {movie.Year}</p>
  </div>
);

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Função para buscar filmes por termo
  const fetchMovies = async (term = 'batman') => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`https://www.omdbapi.com/?s=${term}&apikey=${API_KEY}`);

      if (response.data.Response === "True") {
        setMovies(response.data.Search);
      } else {
        setMovies([]); // Nenhum filme encontrado
        setError(response.data.Error);
      }
    } catch (err) {
      console.error('Erro ao buscar filmes:', err);
      setError('Erro ao buscar filmes. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Efeito para buscar um filme padrão ao carregar o app
  useEffect(() => {
    fetchMovies();
  }, []);

  // Função de busca com debounce
  const handleSearch = async () => {
    if (searchTerm.trim() === '') return;
    fetchMovies(searchTerm);
  };

  // Renderização
  return (
    <div className="app" style={{ backgroundColor: '#121212', color: '#FFF', minHeight: '100vh', padding: '20px' }}>
      <h1 className="title">Movie Search App</h1>

      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a movie..."
          className="search-bar"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="movies-container">
          {movies.length > 0 ? (
            movies.map((movie) => <MovieCard key={movie.imdbID} movie={movie} />)
          ) : (
            <p>Nenhum filme encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
