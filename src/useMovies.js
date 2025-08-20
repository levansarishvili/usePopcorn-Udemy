import { useEffect, useState } from "react";

export function useMovies(query) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);

  const KEY = "2f0d9085";

  useEffect(() => {
    const controller = new AbortController();
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!response.ok)
          throw new Error("Something went wrong when fetching movies!");

        const data = await response.json();
        if (data.Response === "False") throw new Error("Movie not found!");

        setMovies(data.Search);
        setIsLoading(false);
        setError("");
      } catch (err) {
        setError(err.message);

        if (err.message !== "AbortError") {
          setIsLoading(false);
        }
      } finally {
      }
    };

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    fetchMovies();

    return () => {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
}
