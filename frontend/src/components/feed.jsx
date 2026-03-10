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
          // drop open a modal//
          <div>
            <img />
          </div>
          <div>
            <input placeholder="Wanna say something?" />
          </div>
        </div>
        {feedView === "for you" ? (
          <div className="forYouPosts">
            {forYouFeedErr ? (
              <div>{forYouFeedErr}</div>
            ) : (
              <div>
                {forYouFeed.map((post) => {
                  <div key={post.id} className="postContainer">
                    <div className="postersPFP">
                      <div onClick={viewProfile}>
                        <img
                          src={`http://localhost:5555/${post.postedBy.pfp}`}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="postInfo">
                        <div>{post.username}</div>
                        <div>{post.createdAt}</div>
                      </div>
                      <div className="postMsg">
                        <div>{post.msg}</div>
                      </div>
                      <div className="postImg">
                        {post.img ? (
                          <div>
                            <img src={`http://localhost:5555/${post.img}`} />
                          </div>
                        ) : null}
                      </div>
                      <div className="postOptions">
                        <div>
                          <div></div>
                          <div></div>
                        </div>
                        <div>
                          <div></div>
                          <div></div>
                        </div>
                        <div>
                          <div></div>
                          <div></div>
                        </div>
                        <div>
                          <div></div>
                          <div></div>
                        </div>
                      </div>
                    </div>
                  </div>;
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="followingPosts"></div>
        )}
      </div>
    </div>
  );
}

export default Feed;
