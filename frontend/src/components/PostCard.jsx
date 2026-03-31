import { Link } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import MakeAComment from "./makeAComment";

function PostCard({ post, onClick, onDelete }) {
  const { user } = useOutletContext();

  const [refreshPost, setRefreshPost] = useState(post);

  const name = post.postedBy?.name || post.name;
  const username = post.postedBy?.username || post.username;
  const pfp = post.postedBy?.profile?.pfp || post.pfp;
  const formattedDate = post.createdAt ? post.createdAt.split("T")[0] : "";

  const postByLoggedInUser = post.postedBy?.id === user?.id ? true : false;

  const [dotsClicked, setDotsClicked] = useState(false);
  const [preDeleteModalClicked, setPreDeleteModalClicked] = useState(false);

  const [openMakeACommentModal, setOpenCommentModal] = useState(false);

  useEffect(() => {
    function checkURL() {}
    checkURL();
  }, []);

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

      setRefreshPost((prev) => {
        const userLiked = prev.likes?.some(
          (like) => like.idOfLiker === user?.id,
        );

        if (userLiked) {
          return {
            ...prev,
            likes: prev.likes.filter((like) => like.idOfLiker !== user?.id),
          };
        } else {
          return {
            ...prev,
            likes: [...(prev.likes || []), { idOfLiker: user?.id }],
          };
        }
      });
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

      setRefreshPost((prev) => {
        const userReposted = prev.reposts?.some(
          (repost) => repost.repostedBy === user?.id,
        );

        if (userReposted) {
          return {
            ...prev,
            reposts: prev.reposts.filter(
              (repost) => repost.repostedBy !== user?.id,
            ),
          };
        } else {
          return {
            ...prev,
            reposts: [...prev.reposts, { repostedBy: user?.id }],
          };
        }
      });
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
          <Link to={`/${username}`}>
            <img
              src={`http://localhost:5555/pfpIMG/${pfp || "default-png.jpg"}`}
            />
          </Link>
        </div>
        <div>
          <div>
            <div className="postUserInfo">
              <div>
                {name} {username}
              </div>
              <div>.</div>
              <div>{formattedDate}</div>
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
              {post.msg && <div className="postMsg">{post.msg}</div>}

              {post.img && (
                <div className="postImg">
                  <img src={`http://localhost:5555/pfpIMG/${post.img}`} />
                </div>
              )}
            </div>
          </div>
          <div className="postOptions">
            <div
              className="likes"
              onClick={(e) => {
                e.stopPropagation();
                toggleLike();
              }}
            >
              <div>
                <img
                  src="/imgs/heart-svgrepo-com.svg"
                  alt="like"
                  className={
                    refreshPost.likes?.some(
                      (like) => like.idOfLiker === user?.id,
                    )
                      ? "userLikedThisPost"
                      : "heartTolike"
                  }
                />
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(refreshPost);
                }}
              >
                {refreshPost.likes?.length}
              </div>
            </div>

            <div
              className="comments"
              onClick={(e) => {
                e.stopPropagation();
                setOpenCommentModal(true);
              }}
            >
              <div>
                <img src="/imgs/comment-4-svgrepo-com.svg" alt="comment" />
              </div>
              <div>{refreshPost.commentReplies?.length}</div>
            </div>

            <div
              className="reposts"
              onClick={(e) => {
                e.stopPropagation();
                toggleRepost();
              }}
            >
              <div>
                <img
                  src="/imgs/repost-2-svgrepo-com.svg"
                  alt="repost"
                  className={
                    refreshPost.reposts?.some(
                      (repost) => repost.repostedBy === user?.id,
                    )
                      ? "userRepostedThisPost"
                      : "repost"
                  }
                />
              </div>
              <div>{refreshPost.reposts?.length}</div>
            </div>

            <div className="share">
              <div>
                <img src="/imgs/share-1-svgrepo-com.svg" alt="share" />
              </div>
              <div>Share</div>
            </div>
          </div>
        </div>
      </div>

      {openMakeACommentModal && (
        <MakeAComment post={post} closeModal={(e) => closeModal(e)} />
      )}
    </div>
  );
}

export default PostCard;
