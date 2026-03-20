import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function MakeAComment({ post, closeModal }) {
  const [comment, setComment] = useState("");

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
      <form onSubmit={makeComment}></form>
    </div>
  );
}

export default MakeAComment;
