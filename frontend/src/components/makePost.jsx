import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";

function MakeAPost({ onClose }) {
  const { user, userProfile } = useOutletContext();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [msgToPost, setMsgToPost] = useState("");
  const [postAPIErr, setPostAPIErr] = useState(null);
  const [showPostAPIErr, setShowPostAPIErr] = useState(false);

  async function postIt(e) {
    e.preventDefault();

    if (!msgToPost && selectedFiles.length === 0) {
      return;
    }

    const form = new FormData();

    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        form.append("files", file);
      });
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
        setPostAPIErr(null);
        onClose();
        // when post is successful pop up over lay to view post
        return;
      }
    } catch (error) {
      setPostAPIErr("Error encountered while trying to post");
      setShowPostAPIErr(true);
    }
  }

  function cancel(e) {
    e.preventDefault();
    onClose();
  }

  function removeAPIErr() {
    setShowPostAPIErr(false);
  }

  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <div className="makeAPost div">
          {postAPIErr && showPostAPIErr ? (
            <div>
              {postAPIErr}
              <button onClick={removeAPIErr}>retry</button>
            </div>
          ) : null}

          <form onSubmit={postIt}>
            <div>
              <div onClick={cancel} className="xPost">
                x
              </div>
            </div>
            <div className="newPostMain">
              <div>
                <div>
                  <img
                    className="newPostPFP"
                    src={`http://localhost:5555/pfpIMG/${userProfile?.pfp || "default-png.jpg"}`}
                  />
                </div>
                <div className="divInputForPostText">
                  <textarea
                    placeholder="What's new?"
                    value={msgToPost}
                    onChange={(e) => setMsgToPost(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="postPost">
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
              <div>
                {msgToPost || selectedFiles.length > 0 ? (
                  <button className="can-post-btn" type="submit">
                    post
                  </button>
                ) : (
                  <div className="cannot-post-btn">post</div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MakeAPost;
