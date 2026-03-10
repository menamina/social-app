import { useState } from "react";
import { OutletContext, Link } from "react-router-dom";

// MAKE  MODAL TO POST A MESSAGE //
// IMPOT THE POST JSX HERE BUT MAKE IT OVER //

function Feed() {
  const {
    user,
    forYouFeed,
    setForYouFeed,
    forYouFeedErr,
    setForYouFeedErr,
    setClickedOnPost,
  } = OutletContext();

  const [followingFeed, setFollowingFeed] = useState(null);
  const [followingFeedErr, setFollowingFeedErr] = useState(null);

  const [feedView, setFeedView] = useState("for you");

  async function forYouRefresh() {
    setFeedView("for you");
    try {
      const res = await fetch("http://localhost:5555/for-you-feed", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      setForYouFeed(data.allPosts);
    } catch (error) {
      setForYouFeedErr(error.errorMsg);
    }
  }

  async function followingRefresh() {
    setFeedView("following");
    try {
      const res = await fetch("http://localhost:5555/followingFeed", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      setFollowingFeed(data.followingPosts);
    } catch (error) {
      setFollowingFeedErr(error.errorMsg);
    }
  }

  function changeClickedOnPost({ post }) {
    setClickedOnPost(post);
  }

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
            <img src={`http://localhost:5555/pfpIMG/${user.pfp}`} />
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
                {forYouFeed.map((post) => (
                  <Link
                    to={`http://localhost:5555/@${post.username}/post/${post.id}`}
                    key={post.id}
                    className="postContainer"
                    onClick={() => changeClickedOnPost({ post })}
                  >
                    <div className="postersPFP">
                      <Link to={`http://localhost:5555/${post.madeBy}`}>
                        <img
                          src={`http://localhost:5555/pfpIMG/${post.postedBy.pfp}`}
                        />
                      </Link>
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
                        <div className="likes">
                          <div>
                            <img />
                          </div>
                          <div>{post.likes.length}</div>
                        </div>

                        <div className="comments">
                          <div>
                            <img />
                          </div>
                          <div>{post.comments.length}</div>
                        </div>

                        <div className="reposts">
                          <div>
                            <img />
                          </div>
                          <div>{post.likes.length}</div>
                        </div>

                        <div className="share">
                          <div>
                            <img />
                          </div>
                          <div>Share</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="followingPosts">
            {followingFeedErr ? (
              <div>{followingFeedErr}</div>
            ) : (
              <div>
                {followingFeed.map((post) => (
                  <Link
                    to={`http://localhost:5555/@${post.username}/post/${post.id}`}
                    key={post.id}
                    className="postContainer"
                    onClick={() => changeClickedOnPost({ post })}
                  >
                    <div className="postersPFP">
                      <Link to={`http://localhost:5555/${post.madeBy}`}>
                        <img
                          src={`http://localhost:5555/pfpIMG/${post.postedBy.pfp}`}
                        />
                      </Link>
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
                        <div className="likes">
                          <div>
                            <img />
                          </div>
                          <div>{post.likes.length}</div>
                        </div>

                        <div className="comments">
                          <div>
                            <img />
                          </div>
                          <div>{post.comments.length}</div>
                        </div>

                        <div className="reposts">
                          <div>
                            <img />
                          </div>
                          <div>{post.likes.length}</div>
                        </div>

                        <div className="share">
                          <div>
                            <img />
                          </div>
                          <div>Share</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;
