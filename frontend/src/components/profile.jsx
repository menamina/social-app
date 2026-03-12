import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import PostCard from "./PostCard";

function Profile() {
  const { username } = useParams();
  const [profileViewOption, setProfileViewOption] = useState("posts");
  const [profileData, setProfileData] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
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

        if (res.status === 403 || res.status === 404) {
          setError(data.errorMsg || "Profile not found");
          setLoading(false);
          return;
        }
        if (data.viewThisUserProfile) {
          setProfileData(data.viewThisUserProfile);
          setAllPosts([
            ...data.viewThisUserProfile.posts,
            ...data.viewThisUserProfile.reposts.map((repost) => repost.post),
          ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
          setIsOwnProfile(true);
        } else if (data.userProfile) {
          setProfileData(data.userProfile);
          setAllPosts([
            ...data.userProfile.posts,
            ...data.userProfile.reposts.map((repost) => repost.post),
          ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
          setIsOwnProfile(false);
        }

        setLoading(false);
      } catch (error) {
        setError("Failed to load profile");
        setLoading(false);
      }
    }

    if (username) {
      fetchProfileData();
    }
  }, [username]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!profileData) {
    return <div>Profile not found</div>;
  }

  return (
    <div>
      <div>Profile</div>
      <div>
        <div>
          <div>
            <div>
              <div>{profileData.name}</div>
              <div>{profileData.username}</div>
              <div>
                <div>{profileData.followers.length}</div>
                <div>{profileData.following.length}</div>
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
          <div>
            <div onClick={() => profileViewOpt("posts")}>Posts</div>
            <div onClick={() => profileViewOpt("comments")}>Comments</div>
            <div onClick={() => profileViewOpt("likes")}>Likes</div>
          </div>
          <div>
            {profileViewOption === "posts"
              ? allPosts.map((post) => <PostCard key={post.id} post={post} />)
              : null}
            {profileViewOption === "comments"
              ? profileData.comments.map((comment) => (
                  <PostCard key={comment.id} post={comment.post} />
                ))
              : null}

            {profileViewOption === "likes"
              ? profileData.likes.map((like) => (
                  <PostCard key={like.id} post={like.post} />
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
