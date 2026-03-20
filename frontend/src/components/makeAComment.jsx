import { useState, useEffect } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";

function MakeAComment({ post, closeModal }) {
  const [comment, setComment] = useState("");
  const { user } = useOutletContext();

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

      const data = await res.json();
    } catch (error) {
      console.log(error.errorMsg);
    }
  }

  return (
    <div className="modalBackdrop" onClick={closeModal}>
      <div>
        <div>
          <div>cancel</div>
          <div>Reply</div>
        </div>

        <div>
          <div>
            <div>
              <div>
                <img
                  src={`http://localhost:5555/img/${post.postedBy.profile.pfp}`}
                  alt={`${post.username} profile pic`}
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
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default MakeAComment;
