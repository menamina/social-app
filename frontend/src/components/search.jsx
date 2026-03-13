import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

function Search() {
  const [query, setQuery] = useState("");
  const [queryResultsUsername, setQueryResultsUserName] = useState(null);
  const [queryResultsPosts, setQueryResultsPosts] = useState(null);
  const [noQueryToReturn, setNoQueryToReturn] = useState(null);
  const [queryError, setQueryError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5555/search", {
          method: "GET",
          credentials: "include",
          body: JSON.stringify({
            query,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setNoQueryToReturn(data.noResult);
          setLoading(false);
          return;
        }

        setQueryResultsUserName(data.userSearchRes);
        setQueryResultsPosts(data.postSearchRes);
        setLoading(false);
        return;
      } catch (error) {
        setQueryError(error.errMsg);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="searchDiv">
      <div>Search</div>
      <div>
        <div>
          <input
            name="seach bar"
            placeholder="search"
            aria-label="search bar"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          ></input>
        </div>
        <div>
          {loading && <div>...</div>}
          {noQueryToReturn && <div>{noQueryToReturn}</div>}
          {queryError && <div>{noQueryToReturn}</div>}
          {queryResults &&
            queryResults.map((result) => {
              <div key={result.id} id={result.id}></div>;
            })}
        </div>
      </div>
    </div>
  );
}

export default Search;
