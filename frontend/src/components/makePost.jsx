import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";

function MakeAPost() {
  const { user, userProfile } = useOutletContext();
  const [selectedFiles, setSelectedFiles] = useState([]);

  async function post() {}

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
          <button>post</button>
        </div>
      </form>
    </div>
  );
}

export default MakeAPost;
