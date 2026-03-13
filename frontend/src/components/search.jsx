import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

function Search() {
  const [query, setQuery] = useState("");
  const [queryResults, setQueryResults] = useState(null);
  const [queryError, setQueryError] = useState(null);

  useEffect(() => {
    async function searchRes() {
      setInterval(() => {}, 3000);
    }
    searchRes();
  }, [query]);
}

export default Search;
