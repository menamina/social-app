import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import MakeAPost from "./makePost";
import PostCard from "./PostCard";

function Feed() {
  const {
    user,
    forYouFeed,
    setForYouFeed,
    forYouFeedErr,
    setForYouFeedErr,
    followingFeed,
    setFollowingFeed,
    followingFeedErr,
    setFollowingFeedErr,
    setShowPostComments,
  } = useOutletContext();

  const [feedView, setFeedView] = useState("for you");
  const [wannaMakeAPost, setWannaMakeAPost] = useState(false);

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

  function openMakeAPostModal() {
    setWannaMakeAPost(true);
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
            <img
              src={`http://localhost:5555/pfpIMG/${user.profile?.pfp || user.pfp}`}
            />
          </div>
          <div>
            <input
              placeholder="Wanna say something?"
              onClick={openMakeAPostModal}
            />
          </div>
          {wannaMakeAPost && <MakeAPost />}
        </div>
        {feedView === "for you" ? (
          <div className="forYouPosts">
            {forYouFeedErr ? (
              <div>{forYouFeedErr}</div>
            ) : (
              <div>
                {forYouFeed.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onClick={() => setShowPostComments(true)}
                  />
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
                  <PostCard
                    key={post.id}
                    post={post}
                    onClick={() => setShowPostComments(true)}
                  />
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
