import { Link } from "react-router-dom";

function PostCard({ post, onClick }) {
  const username = post.postedBy?.username || post.username;
  const pfp = post.postedBy?.profile?.pfp || post.pfp;

  return (
    <div>
      <Link
        to={`http://localhost:5555/@${username}/post/${post.id}`}
        className="postContainer"
        onClick={onClick}
      >
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
      </Link>

      {post.comments && post.comments.length > 0 && (
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
                  <div className="commentUsername">{comment.user?.username}</div>
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
