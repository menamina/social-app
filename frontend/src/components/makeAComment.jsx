import { useState } from "react";
import { useOutletContext } from "react-router-dom";

function MakeAComment({ post, closeModal }) {
  const [comment, setComment] = useState("");
  const { user, profileData } = useOutletContext();

  async function makeComment() {
    try {
      const res = await fetch("http://localhost:5555/comment", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postID: post.id,
          commentBody: comment,
        }),
      });

      await res.json();
      if (res.status === 200) {
        console.log("COMMENT POSTED");
        closeModal();
      }
    } catch (error) {
      console.log(error.errorMsg);
    }
  }

  return (
    <div className="modalBackdrop" onClick={closeModal}>
      <div className="commentModalContent" onClick={(e) => e.stopPropagation()}>
        <div className="commentModalHeader">
          <div onClick={closeModal} className="cursor-reg">✕</div>
        </div>

        <div className="commentModalBody">
          <div className="originalPostSection">
            <img
              className="commentPFP"
              src={`http://localhost:5555/pfpIMG/${post.postedBy.profile.pfp}`}
              alt={`${post.postedBy.username} profile pic`}
            />
            <div className="originalPostContent">
              <div className="postUserInfo">
                <span className="postUsername">@{post.postedBy.username}</span>
              </div>
              {post.msg && <div className="postMsg">{post.msg}</div>}
              {post.img && (
                <div className="commentPostImg">
                  <img src={`http://localhost:5555/pfpIMG/${post.img}`} alt="post image" />
                </div>
              )}
            </div>
          </div>

          <div className="replySection">
            <img
              className="commentPFP"
              src={`http://localhost:5555/pfpIMG/${profileData?.pfp || user?.profile?.pfp || 'default-png.jpg'}`}
              alt={`${user.name} profile pic`}
            />
            <div className="replyInputWrapper">
              <div className="replyUsername">@{user.username}</div>
              <textarea
                className="commentInput"
                placeholder={`Reply to @${post.postedBy.username}...`}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="commentModalFooter">
          <button
            onClick={(e) => {
              e.stopPropagation();
              makeComment();
            }}
            className={comment ? "commentPostBtn active cursor-reg" : "commentPostBtn disabled"}
            disabled={!comment}
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}

export default MakeAComment;
