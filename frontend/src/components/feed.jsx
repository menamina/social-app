// this is what will fetch api to view other users profiles as well

import { useState, useEffect } from "react";
import { OutletContext, useNavigate } from "react-router-dom";

function Feed() {
  const { forYouFeed, setForYouFeed, forYouFeedErr, setForYouFeedErr } =
    OutletContext();

  const [followingFeed, setFollowingFeed] = useState(null);

  const [feedView, setFeedView] = useState("for you");

  async function forYouRefresh() {}

  async function followingRefresh() {}

  return (
    <div className="feed">
      <div className="feedOpts">
        <div onClick={forYouRefresh}>For You</div>
        <div>|</div>
        <div onClick={followingRefresh}>Following</div>
      </div>

      <div className="feedPosts">
        <div>
          <div>
            <img />
          </div>
          <div>
            <input placeholder="Wanna say something?" />
          </div>
        </div>
        {feedView === "for you" ? (
          <div className="forYouPosts"></div>
        ) : (
          <div className="followingPosts"></div>
        )}
      </div>
    </div>
  );
}

export default Feed;
