import { Link } from "react-router-dom";
import PostCard from "./PostCard";

function MoreSearchResults({ results, type, onDelete, setShowPostComments }) {
  return (
    <div className="moreSearchResults">
      <div className="moreSearchHeader">
        <h2>{type === "users" ? "All User Results" : "All Post Results"}</h2>
      </div>
      <div className="moreSearchContent">
        {type === "users" ? (
          <div className="userResultsList">
            {results.map((user) => (
              <Link to={`/${user.username}`} key={user.id} id={user.id}>
                <div className="userResultItem">
                  <div>
                    <img
                      src={`http://localhost:5555/img/${user.profile.pfp}`}
                      alt={user.username}
                    />
                  </div>
                  <div>
                    <div>{user.name}</div>
                    <div>{user.username}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="postResultsList">
            {results.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                post={post}
                onClick={() => setShowPostComments(true)}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MoreSearchResults;
