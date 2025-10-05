import React, { useEffect, useState } from 'react'
import Search from "./components/search.jsx";
import Moviecard from "./components/moviecard.jsx";
import { useDebounce } from "react-use";


const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: new Headers({
        accept: 'application/json',
        authorization: `Bearer ${API_KEY}`,
    }),
};

const App = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    useDebounce(() => setDebouncedSearchTerm(searchTerm),500, [searchTerm])

    const fetchMovies = async ( query = '') => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
            : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error("Failed to fetch movies");
            }

            const data = await response.json();

            if (!data.results) {
                setErrorMessage(data.error || "Failed to fetch movies");
                setMovieList([]);
                return;
            }

            setMovieList(data.results);
        } catch (error) {
            console.log(`Error fetching movies: ${error}`);
            setErrorMessage(`Error fetching movies, please try again: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    return (
        <main>
            <div className='pattern' />
            <div className='wrapper'>
                <header>
                    <img src='./hero.png' alt='hero banner' />
                    <h1>
                        Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle
                    </h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                <section className="all-movies">
                    <h2 className="mt-[40px]">All Movies</h2>
                    {isLoading ? (
                        <p className="text-white">Loading...</p>
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        movieList.map((movie) => (
                          <Moviecard key={movie.id} movie={movie} />
                        ))
                    )}
                </section>
            </div>
        </main>
    );
};

export default App;
