import { useState, useEffect } from "react";
import { Link, useParams, useOutletContext } from "react-router-dom";
import PostCard from "./PostCard";

function Profile() {
  const { username } = useParams();
  const { setShowPostComments } = useOutletContext();

  const [profileViewOption, setProfileViewOption] = useState("posts");

  const [profileData, setProfileData] = useState(null);
  const [allPosts, setAllPosts] = useState([]);

   const [youAreBlocked, setYouAreBlockedStatus] = useState(false)
   const [youBlocked, setYouBlockedStatus] = useState(false)


  const [isOwnProfile, setIsOwnProfile] = useState(false);


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function profileViewOpt(option) {
    if (option === "posts") setProfileViewOption("posts");
    if (option === "comments") setProfileViewOption("comments");
    if (option === "likes") setProfileViewOption("likes");
  }

  useEffect(() => {
    async function fetchProfileData() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`http://localhost:5555/@${username}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (data.youAreBlocked ) {
          setYouAreBlockedStatus(true)
          setYouBlockedStatus(false)
          setLoading(false);
          return;
        }

        if(data.youBlocked){
          setYouAreBlockedStatus(false)
          setYouBlockedStatus(true)
          setLoading(false);
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
          setYouAreBlockedStatus(true)
          setYouBlockedStatus(false)
        } else if (data.userProfile) {
          setProfileData(data.userProfile);
          setAllPosts(
            [
              ...data.userProfile.posts,
              ...data.userProfile.reposts.map((repost) => repost.post),
            ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
          );
          setIsOwnProfile(false);
        }

        setLoading(false);
      } catch (error) {
        setError("Failed to load profile");
        setLoading(false);
      }
    }

    fetchProfileData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!profileData) {
    return <div>Profile not found</div>;
  }

  function handleDeletePost(postId) {
    setAllPosts((prev) => prev.filter((post) => post.id !== postId));
    setProfileData((prev) => ({
      ...prev,
      posts: prev.posts.filter((post) => post.id !== postId),
      comments: prev.comments.filter((comment) => comment.post.id !== postId),
      likes: prev.likes.filter((like) => like.post.id !== postId),
    }));
  }

  return (
    <div>
      <div>Profile</div>
      <div>
        <div>
          <div>
            <div>
              <div>
                <div>
                  <div>{profileData.name}</div>
                  <div>{profileData.username}</div>
                </div>
                <div>

                  {!isOwnProfile && 
                  <div>
                    {youAreBlocked && <div>This user blocked you</div>}
                    {youBlocked && <div>Unblock</div>}
                    {!youAreBlocked && !youBlocked ? (
                       <div onClick={() => setDotsClicked(!prev)}>...</div>
                  {dotsClicked && (
                    <div onClick={() => setBlockButtonClicked(true)}>block</div>
                  )}
                  {blockButtonClicked && <div></div>}
                  {}
                  {!isOwnProfile && (
                    <div onClick={updateFollowStatus}>{followStatus}</div>
                  ) : null}
                    )}
                                       
                  </div>
                
                </div>
              </div>
              <div>
                <div>{profileData.followers.length} followers</div>
                <div>{profileData.following.length} folowing</div>
              </div>
            </div>
            <div>
              <div>
                <img
                  src={`http://localhost:5555/pfpIMG/${profileData.profile?.pfp || profileData.pfp}`}
                />
              </div>
              {isOwnProfile && (
                <div>
                  <Link to="/settings">edit</Link>
                </div>
              )}
            </div>
          </div>

          {accountBlocked && 
          <div>
            <h2>@{profileData.username} is blocked</h2>
            <div>unblock them to view their posts</div>
            </div>}

          {!accountBlocked && (
            <div>
              <div>
                <div onClick={() => profileViewOpt("posts")}>Posts</div>
                <div onClick={() => profileViewOpt("comments")}>Comments</div>
                <div onClick={() => profileViewOpt("likes")}>Likes</div>
              </div>
              <div>
                {profileViewOption === "posts"
                  ? allPosts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onClick={() => setShowPostComments(true)}
                        onDelete={handleDeletePost}
                      />
                    ))
                  : null}

                {profileViewOption === "comments"
                  ? profileData.comments.map((comment) => (
                      <PostCard
                        key={comment.id}
                        post={comment.post}
                        onClick={() => setShowPostComments(true)}
                        onDelete={handleDeletePost}
                      />
                    ))
                  : null}

                {profileViewOption === "likes"
                  ? profileData.likes.map((like) => (
                      <PostCard
                        key={like.id}
                        post={like.post}
                        onClick={() => setShowPostComments(true)}
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
