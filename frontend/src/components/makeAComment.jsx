import { useState } from "react";
import { useOutletContext } from "react-router-dom";

function MakeAComment({ post, closeModal }) {
  const [comment, setComment] = useState("");
  const { user, userProfile } = useOutletContext();

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
    } catch (error) {
      console.log(error.errorMsg);
    }
  }

  return (
    <div className="modalBackdrop" onClick={closeModal}>
      <div className="modalContent">
        <div>
          <div onClick={closeModal}>cancel</div>
          <div>Reply</div>
        </div>

        <div>
          <div>
            <div>
              <div>
                <img
                  src={`http://localhost:5555/img/${post.postedBy.profile.pfp}`}
                  alt={`${post.postedBy.username} profile pic`}
                />
              </div>
              <div>
                <div>
                  <div>{post.username}</div> <div>{post.createdAt}</div>
                </div>
                {post.img && (
                  <div>
                    <img src={`http://localhost:5555/img/${post.img}`} />
                  </div>
                )}
                {post.msg && <div>{post.msg}</div>}
              </div>
            </div>
          </div>
          <div>
            <div>
                <img
                  src={`http://localhost:5555/img/${userProfile?.pfp}`}
                  alt={`${user.name} profile pic`}
                />
              </div>
              <div>
                <div>
                  <div>{user.username}</div>
                </div>
                <input placeholder={`Reply to ${post.postedBy.username}...`} value={comment} onChange={(e) => setComment(e.target.value)}></input>
              </div>
          </div>
        </div>
        <div onClick={makeComment}>post</div>
      </div>
    </div>
  );
}

export default MakeAComment;
