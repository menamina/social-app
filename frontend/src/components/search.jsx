import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import PostCard from "./PostCard";

function Search() {
  const { setShowPostComments } = useOutletContext();

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

        const userResults = data.userSearchRes || [];
        const postResults = data.postSearchRes || [];

        if (userResults.length === 0 && postResults.length === 0) {
          setNoQueryToReturn("No results found");
          setQueryResultsUserName(null);
          setQueryResultsPosts(null);
          setLoading(false);
          return;
        }

        setQueryResultsUserName(userResults.length > 0 ? userResults : null);
        setQueryResultsPosts(postResults.length > 0 ? postResults : null);
        setNoQueryToReturn(null);
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
          {queryError && <div>{queryError}</div>}
          {queryResultsUsername && (
            <div>
              {queryResultsUsername.map((user) => (
                <Link
                  to={`http://localhost:5555/@${user.username}`}
                  key={user.id}
                  id={user.id}
                >
                  <div>
                    <img
                      src={`http://localhost:5555/img/${user.profile.pfp}`}
                    />
                  </div>
                  <div>
                    <div>{user.name}</div>
                    <div>{user.username}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {queryResultsPosts && (
            <div>
              {queryResultsPosts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  post={post}
                  onClick={() => setShowPostComments(true)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
