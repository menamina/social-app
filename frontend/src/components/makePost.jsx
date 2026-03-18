import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";

function MakeAPost() {
  const { user, userProfile } = useOutletContext();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [msgToPost, setMsgToPost] = useState("");
  const [postAPIErr, setPostAPIErr] = useState(null);

  async function post() {
    if (!msgToPost && !selectedFiles) {
      return;
    }

    const form = new FormData();
    if (selectedFiles) {
      form.append("imgs", selectedFiles);
    }

    if (msg) {
    }

    try {
      const res = await fetch("http://localhost:5555/post", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
    } catch (error) {
      setPostAPIErr("Error encountered while trying to post");
    }
  }

  return (
    <div className="makeAPost div">
      <form onSubmit={postIt}>
        <div>
          <button>cancel</button>
          <div>new post</div>
          <div>
            <img
              alt="Upload imgs"
              onClick={(e) => e.target.nextSibling.click()}
            />
            <input
              type="file"
              multiple
              accept="image/*"
              hidden
              onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
            />
          </div>
        </div>
        <div>
          <div>
            <img src={`http://localhost:/imgs/${userProfile?.pfp}`} />
          </div>
          <div>@{user?.username}</div>
          <div>
            <input
              placeholder="What's new?"
              value={msgToPost}
              onChange={(e) => setMsgToPost(e.target.value)}
            ></input>
          </div>
        </div>
        <div>
          {msgToPost || selectedFiles ? (
            <button className="can-post-btn">post</button>
          ) : (
            <div className="cannot-post-btn">post</div>
          )}
        </div>
      </form>
    </div>
  );
}

export default MakeAPost;
