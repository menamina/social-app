import { Link } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";

function PostCard({ post, onClick }) {
  const { showPostComments, setShowPostComments } = useOutletContext();
  const username = post.postedBy?.username || post.username;
  const pfp = post.postedBy?.profile?.pfp || post.pfp;

  const [likeBoolean, setLikeBoolean] = useState(false);
  const [repostBoolean, setRepostBoolean] = useState(false);

  const [likeError, setLikeError] = useState(null);
  const [likeAPIError, setLikeAPIError] = useState(null);

  const [repostError, setRepostError] = useState(null);
  const [repostAPIError, setRepostAPIError] = useState(null);

  async function toggleLike() {
    setLikeBoolean((prev) => !prev);
    try {
      const res = await fetch("http://localhost:5555/like", {
        method: "POST",
        credentials: "include",
        header: { "Content-Type": "application/json" },
        body: JSON.stringify({
          likeBool: likeBoolean,
        }),
      });

      if (!res.ok) {
        setLikeError("Cannot like post - post may have been deleted");
        setLikeAPIError(null);
        return;
      }

      setLikeError(null);
      setLikeAPIError(null);
      return;
    } catch (error) {
      setLikeAPIError(error.errorMsg);
      setLikeError(null);
    }
  }

  async function toggleRepost() {
    try {
      const res = await fetch("http://localhost:5555/like", {
        method: "POST",
        credentials: "include",
        header: { "Content-Type": "application/json" },
        body: JSON.stringify({
          likeBool: likeBoolean,
        }),
      });

      if (!res.ok) {
        setRepostError("Cannot like post - post may have been deleted");
        setRepostError(null);
        return;
      }

      setRepostError(null);
      setRepostAPIError(null);
      return;
    } catch (error) {
      setRepostAPIError(error.errorMsg);
      setRepostError(null);
    }
  }

  return (
    <div>
      <div>
        <Link to="/" onClick={() => setShowPostComments(false)}>
          go back
        </Link>
      </div>
      <div className="postContainer" onClick={onClick}>
        <div className="postersPFP">
          <Link to={`http://localhost:5555/@${username}`}>
            <img src={`http://localhost:5555/pfpIMG/${pfp}`} />
          </Link>
        </div>
        <div>
          <div className="postInfo">
            <div>{username}</div>
            <div>{post.createdAt}</div>
          </div>
          <div className="postMsg">
            <div>{post.msg}</div>
          </div>
          <div className="postImg">
            {post.img ? (
              <div>
                <img src={`http://localhost:5555/img/${post.img}`} />
              </div>
            ) : null}
          </div>
          <div className="postOptions">
            <div className="likes">
              <div>
                <img onClick={toggleLike} />
                {/* if clicked heart turns red if not heart white */}
              </div>
              <div>{post.likes?.length || 0}</div>
            </div>

            <div className="comments">
              <div>
                <img />
              </div>
              <div>{post.comments?.length || 0}</div>
            </div>

            <div className="reposts">
              <div>
                <img onClick={toggleRepost} />
                {/* if reposted reposted is dark black // inverted */}
              </div>
              <div>{post.reposts?.length || 0}</div>
            </div>

            <div className="share">
              <div>
                <img />
              </div>
              <div>Share</div>
            </div>
          </div>
        </div>
      </div>

      {showPostComments && post.comments && post.comments.length > 0 && (
        <div className="commentsSection">
          {post.comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="commentUser">
                <Link to={`/@${comment.user?.username}`}>
                  <img
                    src={`http://localhost:5555/pfpIMG/${comment.user?.profile?.pfp}`}
                    alt={comment.user?.username}
                  />
                </Link>
                <div>
                  <div className="commentUsername">
                    {comment.user?.username}
                  </div>
                  <div className="commentTime">{comment.createdAt}</div>
                </div>
              </div>
              <div className="commentText">{comment.comment}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostCard;
