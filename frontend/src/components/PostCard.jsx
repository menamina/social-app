import { Link } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";

function PostCard({ post, onClick }) {
  const { setShowPostComments } = useOutletContext();
  const [showLikes, setShowLikes] = useState(false);
  const username = post.postedBy?.username || post.username;
  const pfp = post.postedBy?.profile?.pfp || post.pfp;

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
            <div
              className="likes"
              onClick={(e) => {
                e.stopPropagation();
                setShowLikes(!showLikes);
              }}
            >
              <div>
                <img />
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
                <img />
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

      {activeSection === "comments" &&
        post.comments &&
        post.comments.length > 0 && (
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

      {activeSection === "likes" && post.likes && post.likes.length > 0 && (
        <div className="likesSection">
          {post.likes.map((like) => (
            <div key={like.id} className="like">
              <Link to={`/@${like.user?.username}`}>
                <img
                  src={`http://localhost:5555/pfpIMG/${like.user?.profile?.pfp}`}
                  alt={like.user?.username}
                />
              </Link>
              <div className="likeUsername">{like.user?.username}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostCard;
