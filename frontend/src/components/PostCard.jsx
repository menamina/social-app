import { Link } from "react-router-dom";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MakeAComment from "./makeAComment";

function PostCard({ post, onClick, onDelete }) {
  const { user } = useOutletContext();

  const [refreshPost, setRefreshPost] = useState(post);

  const name = post.postedBy?.name || post.name;
  const username = post.postedBy?.username || post.username;
  const pfp = post.postedBy?.profile?.pfp || post.pfp;

  const postByLoggedInUser = post.postedBy?.id === user?.id ? true : false;

  const [dotsClicked, setDotsClicked] = useState(false);
  const [preDeleteModalClicked, setPreDeleteModalClicked] = useState(false);

  const [openMakeACommentModal, setOpenCommentModal] = useState(false);

  const [cameFromSearch, setCameFromSearch] = useState(false)

  useEffect(() => {
    function checkURL(){


    }
    checkURL()

  }, [])

  function openSettings(e) {
    e.stopPropagation();
    setDotsClicked(!dotsClicked);
  }

  function preDeleteModal(e) {
    e.stopPropagation();
    setPreDeleteModalClicked(true);
  }

  function cancelDelete(e) {
    e.stopPropagation();
    setPreDeleteModalClicked(false);
    setDotsClicked(false);
  }

  async function toggleLike() {
    try {
      const res = await fetch("http://localhost:5555/like", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post.id,
        }),
      });

      if (!res.ok) {
        alert("Error liking/unliking post - post may have been deleted");
        return;
      }
      return;
    } catch (error) {
      alert("Server error while trying to like/unlike post");
    }
  }

  async function toggleRepost() {
    try {
      const res = await fetch("http://localhost:5555/repost", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post.id,
        }),
      });

      if (!res.ok) {
        alert("Cannot repost/unrepost post - post may have been deleted");
        return;
      }

      return;
    } catch (error) {
      alert("Server error, cannot like/unlike post");
    }
  }

  async function sendDelete(e) {
    e.stopPropagation();
    try {
      const res = await fetch("http://localhost:5555/deletePost", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postID: post.id,
        }),
      });

      if (!res.ok) {
        alert("Error deleting post");
        return;
      }
      setPreDeleteModalClicked(false);
      setDotsClicked(false);
      if (onDelete) {
        onDelete(post.id);
      }
    } catch (error) {
      console.log(error);
      alert("Server error deleting post");
    }
  }

  function closeModal(e) {
    setOpenCommentModal(false);
    e.stopPropagation();
  }

  return (
    <div className="postCardDiv">
      <div className="postContainer" onClick={onClick}>
        <div className="postersPFP">
          <Link to={`http://localhost:5555/@${username}`}>
            <img src={`http://localhost:5555/pfpIMG/${pfp}`} />
          </Link>
        </div>
        <div>
          <div>
            <div className="postUserInfo">
              <div>
                {name} {username}
              </div>
              <div>.</div>
              <div>{post.createdAt}</div>
              {postByLoggedInUser && (
                <div>
                  <div onClick={openSettings}>...</div>
                  {dotsClicked && <div onClick={preDeleteModal}>delete</div>}
                  {preDeleteModalClicked && (
                    <div>
                      <div>Delete post?</div>
                      <div>
                        This can’t be undone and it will be removed from your
                        profile, the timeline of any accounts that follow you,
                        and from search results.{" "}
                      </div>
                      <div>
                        <div onClick={sendDelete}>delete</div>
                        <div onClick={cancelDelete}>cancel</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="postContent">
              {post.img && (
                <div className="postImg">
                  <img src={`http://localhost:5555/img/${post.img}`} />
                </div>
              )}

              {post.msg && <div className="postMsg">{post.msg}</div>}
            </div>
          </div>
          <div className="postOptions">
            <div className="likes">
              <div>
                <img
                  onClick={toggleLike}
                  className={
                    post.likes?.some((like) => like.idOfLiker === user?.id)
                      ? "userLikedThisPost"
                      : "heartTolike"
                  }
                />
              </div>
              <div>{post.likes?.length || ""}</div>
            </div>

            <div className="comments">
              <div>
                <img onClick={() => setOpenCommentModal(true)} />
              </div>
              <div>{post.comments?.length || ""}</div>
            </div>

            <div className="reposts">
              <div>
                <img
                  onClick={toggleRepost}
                  className={
                    post.reposts?.some(
                      (repost) => repost.repostedBy === user?.id,
                    )
                      ? "userRepostedThisPost"
                      : "repost"
                  }
                />
              </div>
              <div>{post.reposts?.length || ""}</div>
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

      {openMakeACommentModal && (
        <MakeAComment post={post} closeModal={closeModal} />
      )}
    </div>
  );
}

export default PostCard;
