import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
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
  } = useOutletContext();

  const navigate = useNavigate();

  const [feedView, setFeedView] = useState("for you");
  const [wannaMakeAPost, setWannaMakeAPost] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return null;
    }
  }, []);

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

  function handleDeletePost(postId) {
    setForYouFeed((prev) => prev.filter((post) => post.id !== postId));
    setFollowingFeed((prev) => prev.filter((post) => post.id !== postId));
  }

  return (
    <div className="outletHolderDiv">
      <div className="feedOpts">
        <div
          onClick={forYouRefresh}
          className={
            feedView === "for you"
              ? "selectedFeedView cursor"
              : "cursor feedView"
          }
        >
          For You
        </div>
        <div
          onClick={followingRefresh}
          className={
            feedView === "following"
              ? "selectedFeedView cursor"
              : "cursor feedView"
          }
        >
          Following
        </div>
      </div>

      <div className="feedPosts">
        <div className="beforeRenderingPosts">
          <div>
            <img
              className="feedPFP"
              src={`http://localhost:5555/pfpIMG/${user?.profile?.pfp || user?.pfp || "default-png.jpg"}`}
            />
          </div>
          <div className="inputWrapper">
            <input
              className="wannaSaySomething"
              placeholder="Wanna say something?"
              onClick={openMakeAPostModal}
            />
          </div>
          {wannaMakeAPost && (
            <MakeAPost onClose={() => setWannaMakeAPost(false)} />
          )}
        </div>
        {feedView === "for you" ? (
          <div className="forYouPosts">
            {forYouFeedErr && <div>{forYouFeedErr}</div>}
            {forYouFeed && (
              <div>
                {forYouFeed.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onClick={() =>
                      navigate(`/${post.username}/post/${post.id}`)
                    }
                    onDelete={handleDeletePost}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="followingPosts">
            {followingFeedErr && <div>{followingFeedErr}</div>}
            {followingFeed && (
              <div>
                {followingFeed.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onClick={() =>
                      navigate(`/${post.username}/post/${post.id}`)
                    }
                    onDelete={handleDeletePost}
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
