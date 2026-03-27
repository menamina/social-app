import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
import PostCard from "./PostCard";
import MoreSearchResults from "./MoreSearchResults";

function Search() {
  const { setShowPostComments } = useOutletContext();

  const [query, setQuery] = useState("");
  const [queryResultsUsername, setQueryResultsUserName] = useState(null);
  const [queryResultsPosts, setQueryResultsPosts] = useState(null);
  const [noQueryToReturn, setNoQueryToReturn] = useState(null);
  const [queryError, setQueryError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMoreUsers, setShowMoreUsers] = useState(false);
  const [showMorePosts, setShowMorePosts] = useState(false);

  useEffect(() => {
    if (!query) {
      setQueryResultsUserName(null);
      setQueryResultsPosts(null);
      setNoQueryToReturn(null);
      setShowMoreUsers(false);
      setShowMorePosts(false);
      setLoading(false);
      return;
    }
    setNoQueryToReturn(null);
    setQueryError(null);
    setQueryResultsUserName(null);
    setQueryResultsPosts(null);
    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `http://localhost:5555/search?query=${encodeURIComponent(query)}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await res.json();

        if (res.status === 404) {
          setNoQueryToReturn(data.errorMsg);
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
        setShowMoreUsers(false);
        setShowMorePosts(false);
        setLoading(false);
      } catch (error) {
        setQueryError(error.errMsg);
        setLoading(false);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [query]);

  function handleDeletePost(postId) {
    setQueryResultsPosts((prev) => prev.filter((post) => post.id !== postId));
  }

  return (
    <div className="outletHolderDiv">
      <div className="searchTop">
        <div>Search</div>
        <div>
          <input
            className="slashSearchInput"
            name="seach bar"
            placeholder="search"
            aria-label="search bar"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          ></input>
        </div>
      </div>
      <div className="resultsDiv">
        <div>
          {loading && <div>...</div>}
          {!loading && noQueryToReturn && <div>{noQueryToReturn}</div>}
          {!loading && queryError && <div>{queryError}</div>}
          {!showMoreUsers && !showMorePosts && (
            <>
              {queryResultsUsername && (
                <div className="usersResults">
                  <h3>Users</h3>
                  {queryResultsUsername.slice(0, 10).map((user) => (
                    <Link to={`/${user.username}`} key={user.id} id={user.id}>
                      <div>
                        <img
                          src={`http://localhost:5555/pfpIMG/${user.profile.pfp}`}
                          alt={user.username}
                        />
                      </div>
                      <div>
                        <div>{user.name}</div>
                        <div>{user.username}</div>
                      </div>
                    </Link>
                  ))}
                  {queryResultsUsername.length > 10 && (
                    <button
                      onClick={() => setShowMoreUsers(true)}
                      className="seeMoreButton"
                    >
                      See more users ({queryResultsUsername.length - 10} more)
                    </button>
                  )}
                </div>
              )}
              {queryResultsPosts && (
                <div className="postRes">
                  <h3>Posts</h3>
                  {queryResultsPosts.slice(0, 10).map((post) => (
                    <PostCard
                      key={post.id}
                      id={post.id}
                      post={post}
                      onClick={() => setShowPostComments(true)}
                      onDelete={handleDeletePost}
                    />
                  ))}
                  {queryResultsPosts.length > 10 && (
                    <button
                      onClick={() => setShowMorePosts(true)}
                      className="seeMoreButton"
                    >
                      See more posts ({queryResultsPosts.length - 10} more)
                    </button>
                  )}
                </div>
              )}
            </>
          )}
          {queryResultsUsername && showMoreUsers && (
            <div>
              <button
                onClick={() => setShowMoreUsers(false)}
                className="backButton"
              >
                ← Back to results
              </button>
              <MoreSearchResults
                results={queryResultsUsername}
                type="users"
                onDelete={handleDeletePost}
                setShowPostComments={setShowPostComments}
              />
            </div>
          )}
          {queryResultsPosts && showMorePosts && (
            <div>
              <button
                onClick={() => setShowMorePosts(false)}
                className="backButton"
              >
                ← Back to results
              </button>
              <MoreSearchResults
                results={queryResultsPosts}
                type="posts"
                onDelete={handleDeletePost}
                setShowPostComments={setShowPostComments}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
