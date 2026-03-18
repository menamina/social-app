import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";

function MakeAPost() {
  const { user, userProfile } = useOutletContext();
  return (
    <div className="makeAPost div">
      <div>
        <button>cancel</button>
        <div>new post</div>
        <img src="" alt="" />
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
    </div>
  );
}

export default MakeAPost;
