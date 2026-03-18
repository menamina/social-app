import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";

function MakeAPost() {
  const { user, userProfile } = useOutletContext();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [msgToPost, setMsgToPost] = useState("");
  const [postAPIErr, setPostAPIErr] = useState(null);
  const [showPostAPIErr, setShowPostAPIErr] = useState(false);
  const [cancelPost, setCancelPost] = useState(false);

  async function postIt() {
    if (!msgToPost && !selectedFiles) {
      return;
    }

    const form = new FormData();
    if (selectedFiles) {
      form.append("imgs", selectedFiles);
    }

    if (msgToPost) {
      form.append("msg", msgToPost);
    }

    try {
      const res = await fetch("http://localhost:5555/post", {
        method: "POST",
        credentials: "include",
        body: form,
      });

      if (res.ok) {
        setShowPostAPIErr(true);
        setPostAPIErr(null);
        return;
      }
    } catch (error) {
      setPostAPIErr("Error encountered while trying to post");
    }
  }

  function cancel() {
    setCancelPost(true);
    setMsgToPost("");
    setSelectedFiles(null);
  }

  function removeAPIErr() {
    setShowPostAPIErr(false);
  }

  if (cancelPost === true) {
    return;
  }

  return (
    <div className="makeAPost div">
      {postAPIErr && showPostAPIErr ? (
        <div>
          {postAPIErr}
          <button onClick={removeAPIErr}>retry</button>
        </div>
      ) : null}

      <form onSubmit={postIt}>
        <div>
          <button onClick={cancel}>cancel</button>
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
