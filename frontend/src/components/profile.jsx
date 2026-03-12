import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
import PostCard from "./PostCard";

function Profile() {
  const { userProfile, setUserProfile, navUserData, setNavUserData } =
    useOutletContext();
  const [profileViewOption, setProfileViewOption] = useState("posts");

  function profileViewOpt(option) {
    if (option === "posts") setProfileViewOption("posts");
    if (option === "comments") setProfileViewOption("comments");
    if (option === "likes") setProfileViewOption("likes");
  }

  useEffect(() => {
    async function refetchUserData() {
      try {
        const res = await fetch(
          `http://localhost:5555/@${navUserData.username}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await res.json();
        setUserProfile(data.viewThisUserProfile);
      } catch (error) {
        return error;
        //  fix later
      }
    }
    refetchUserData;
  }, []);

  if (!userProfile) {
    return <div>loading..</div>;
  }

  return (
    <div>
      <div>Profile</div>
      <div>
        <div>
          <div>
            <div>
              <div>{userProfile.name}</div>
              <div>{userProfile.username}</div>
              <div>
                <div>{userProfile.followers.length}</div>
                <div>{userProfile.following.length}</div>
              </div>
            </div>
            <div>
              <div>
                <img src={`http://localhost:5555/pfpIMG/${userProfile.profile?.pfp || userProfile.pfp}`} />
              </div>
              <div>
                <Link to="/settings">edit</Link>
              </div>
            </div>
          </div>
          <div>
            <div onClick={() => profileViewOpt("posts")}>Posts</div>
            <div onClick={() => profileViewOpt("comments")}>Comments</div>
            <div onClick={() => profileViewOpt("likes")}>Likes</div>
          </div>
          <div>
            {profileViewOption === "posts"
              ? userProfile.posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              : null}
            {profileViewOption === "comments"
              ? userProfile.comments.map((comment) => (
                  <PostCard key={comment.id} post={comment.post} />
                ))
              : null}

            {profileViewOption === "likes"
              ? userProfile.likes.map((like) => (
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
