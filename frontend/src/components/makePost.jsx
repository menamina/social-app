import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";

function MakeAPost({ onClose }) {
  const { user, userProfile, setForYouFeed } = useOutletContext();
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
      form.append("body", msgToPost);
    }

    try {
      const res = await fetch("http://localhost:5555/post", {
        method: "POST",
        credentials: "include",
        body: form,
      });

      const data = await res.json();

      if (res.ok) {
        setPostAPIErr(null);
        setForYouFeed((prev) => [data.justPosted, ...prev]);
        onClose();
        return;
      } else {
        const data = await res.json();
        setPostAPIErr(data.errorMsg || "Failed to create post");
        setShowPostAPIErr(true);
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

  function removeImage() {
    setSelectedFiles([]);
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
              <div onClick={cancel} className="xPost cursor-reg">
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
              {selectedFiles.length > 0 && (
                <div className="imagePreviewContainer">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="imagePreview">
                      <img src={URL.createObjectURL(file)} alt="preview" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="removeImageBtn cursor-reg"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="postPost">
              <img
                src="/imgs/upload-svgrepo-com.svg"
                alt="Upload imgs"
                onClick={(e) => e.target.nextSibling.click()}
                className="cursor-reg"
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
