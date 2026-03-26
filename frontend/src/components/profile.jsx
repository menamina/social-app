import { useState, useEffect } from "react";
import {
  Link,
  useParams,
  useOutletContext,
  useNavigate,
  useLocation,
} from "react-router-dom";
import PostCard from "./PostCard";

function Profile() {
  const { username } = useParams();
  const { user } = useOutletContext();

  const navigate = useNavigate();
  const location = useLocation();

  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const [profileViewOption, setProfileViewOption] = useState("posts");

  const [profileData, setProfileData] = useState(null);
  const [allPosts, setAllPosts] = useState([]);

  const [youAreBlocked, setYouAreBlockedStatus] = useState(false);
  const [youBlocked, setYouBlockedStatus] = useState(false);
  const [noBlockRelation, setNoBlockRelation] = useState(true);

  const [dotsClicked, setDotsClicked] = useState(false);
  const [blockButtonClicked, setBlockButtonClicked] = useState(false);

  const [followStatus, setFollowStatus] = useState(null);
  const [followerStatus, setFollowerStatus] = useState(null);

  const [error, setError] = useState(null);

  const [cameFromSearchURL, setCameFromSearchURL] = useState(false);

  function profileViewOpt(option) {
    if (option === "posts") setProfileViewOption("posts");
    if (option === "likes") setProfileViewOption("likes");
  }

  useEffect(() => {
    function checkURL() {
      if (location.pathname.includes("/search")) {
        setCameFromSearchURL(true);
      }
    }
    checkURL();
  }, [location.pathname]);

  useEffect(() => {
    async function fetchProfileData() {
      if (!user) {
        navigate("/");
        return;
      }
      setError(null);

      console.log("Fetching profile for username:", username);

      try {
        const res = await fetch(`http://localhost:5555/${username}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        console.log(
          "Profile data received:",
          data.viewThisUserProfile || data.userProfile,
        );
        console.log(
          "PFP value:",
          (data.viewThisUserProfile || data.userProfile)?.profile?.pfp,
        );

        if (data.youAreBlocked) {
          setYouAreBlockedStatus(true);
          setYouBlockedStatus(false);
          setFollowStatus(null);
          setNoBlockRelation(false);
          setProfileData(
            data.blockedUserProfile || {
              username: username,
              name: username,
              followers: [],
              following: [],
            },
          );
          return;
        }

        if (data.youBlocked) {
          setYouAreBlockedStatus(false);
          setYouBlockedStatus(true);
          setNoBlockRelation(false);
          setFollowStatus(null);
          setProfileData(
            data.blockedUserProfile || {
              username: username,
              name: username,
              followers: [],
              following: [],
            },
          );
          return;
        }

        if (data.viewThisUserProfile) {
          setProfileData(data.viewThisUserProfile);
          setAllPosts(
            [
              ...data.viewThisUserProfile.posts,
              ...data.viewThisUserProfile.reposts.map((repost) => repost.post),
            ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
          );
          setIsOwnProfile(true);
          setYouAreBlockedStatus(false);
          setYouBlockedStatus(false);
        } else if (data.userProfile) {
          setProfileData(data.userProfile);
          setAllPosts(
            [
              ...data.userProfile.posts,
              ...data.userProfile.reposts.map((repost) => repost.post),
            ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
          );
          setIsOwnProfile(false);
          setYouAreBlockedStatus(false);
          setYouBlockedStatus(false);
          setNoBlockRelation(true);
          const amIFollowing = data.userProfile.followers.find(
            (followers) => followers.id === user.id,
          );
          amIFollowing
            ? setFollowStatus("Following")
            : setFollowStatus("Follow");
          const areTheyFollowingMe = data.userProfile.following.find(
            (followers) => followers.id === user.id,
          );
          areTheyFollowingMe
            ? setFollowerStatus("Follows you")
            : setFollowerStatus("");
        }
      } catch (error) {
        setError("Failed to load profile");
      }
    }
    fetchProfileData();
  }, [username, user, navigate]);

  async function updateFollowStatus() {
    try {
      const res = await fetch(
        `http://localhost:5555/follow/${profileData.id}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const data = await res.json();

      if (data.userFollowed) {
        setFollowStatus("Following");
        setProfileData((prev) => ({
          ...prev,
          followers: [...prev.followers, user],
        }));
      } else if (data.userUnfollowed) {
        setFollowStatus("Follow");
        setProfileData((prev) => ({
          ...prev,
          followers: prev.followers.filter((f) => f.id !== user.id),
        }));
      }
      return;
    } catch (err) {
      console.log(err);
      alert("Sever error while trying to update follow");
    }
  }

  async function handleBlockStatus() {
    try {
      const res = await fetch(`http://localhost:5555/block/${profileData.id}`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (data.userBlocked || data.userUnblocked) {
        window.location.reload();
      }
      return;
    } catch (error) {
      console.log(error);
      alert("Sever error while trying to update block status");
    }
  }

  function cancelBlock() {
    setDotsClicked(false);
    setBlockButtonClicked(false);
  }

  function handleDeletePost(postId) {
    setAllPosts((prev) => prev.filter((post) => post.id !== postId));
    setProfileData((prev) => ({
      ...prev,
      posts: prev.posts.filter((post) => post.id !== postId),
      likes: prev.likes.filter((like) => like.post.id !== postId),
    }));
  }

  return (
    <div className="outletHolderDiv">
      <div className="profileDivMain">
        <div>
          {cameFromSearchURL && (
            <div onClick={() => navigate(-1)}>← go back</div>
          )}
          <div className="preProfPostRender">
            <div>
              <div>
                <div>
                  <img
                    className="profilePFP"
                    src={`http://localhost:5555/pfpIMG/${profileData?.profile?.pfp || profileData?.pfp || "default-png.jpg"}`}
                    alt="profile picture"
                  />
                </div>
                <div className="profileHeader">
                  <div className="profileInfo">
                    <div>{profileData?.name}</div>
                    <div>@{profileData?.username}</div>
                    {followerStatus && <div>FOLLOWS YOU</div>}
                  </div>
                  <div className="profileActions">
                  {!isOwnProfile && (
                    <div>
                      {youAreBlocked && <div>This user blocked you</div>}
                      {youBlocked && (
                        <div onClick={handleBlockStatus}>Unblock</div>
                      )}
                      {noBlockRelation && (
                        <>
                          <div onClick={() => setDotsClicked((prev) => !prev)}>
                            ...
                          </div>
                          {dotsClicked && (
                            <div onClick={() => setBlockButtonClicked(true)}>
                              block
                            </div>
                          )}
                          {blockButtonClicked && (
                            <div>
                              <div></div>
                              <div></div>
                              <div>
                                <div onClick={handleBlockStatus}></div>
                                <div onClick={cancelBlock}></div>
                              </div>
                            </div>
                          )}
                          <div onClick={updateFollowStatus}>
                            {followStatus === "Following"
                              ? "Following"
                              : "Follow"}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {isOwnProfile && (
                    <div className="editProfileLink">
                      <Link to="/settings">edit</Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="follow">
                <div>{profileData?.followers.length} followers</div>
                <div>{profileData?.following.length} folowing</div>
              </div>
            </div>
          </div>

          {youBlocked && (
            <div>
              <h2>@{profileData?.username} is blocked</h2>
              <div>unblock them to view their posts</div>
            </div>
          )}

          {youAreBlocked && (
            <div>
              <h2>@{profileData?.username} has blocked you</h2>
              <div>sad face</div>
            </div>
          )}

          {noBlockRelation && (
            <div>
              <div>
                <div onClick={() => profileViewOpt("posts")}>Posts</div>
                <div onClick={() => profileViewOpt("likes")}>Likes</div>
              </div>
              <div>
                {profileViewOption === "posts"
                  ? allPosts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onClick={() =>
                          navigate(`/${post.username}/post/${post.id}`)
                        }
                        onDelete={handleDeletePost}
                      />
                    ))
                  : null}

                {profileViewOption === "likes"
                  ? profileData?.likes.map((like) => (
                      <PostCard
                        key={like.id}
                        post={like.post}
                        onClick={() =>
                          navigate(
                            `/${like.post.username}/post/${like.post.id}`,
                          )
                        }
                        onDelete={handleDeletePost}
                      />
                    ))
                  : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
