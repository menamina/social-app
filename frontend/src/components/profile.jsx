import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";

function Profile() {
  const { userProfile, setUserProfile, navUserData, setNavUserData } =
    useOutletContext();
  const [profileViewOption, setProfileViewOption] = useState("posts");

  function profileViewOption() {}

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
                <img src={`http://localhost:5555/pfpIMG/${userProfile.pfp}`} />
              </div>
              <div>
                <Link to="/settings">edit</Link>
              </div>
            </div>
          </div>
          <div>
            <div onClick={profileViewOption}>Posts</div>
            <div onClick={profileViewOption}>Comments</div>
            <div onClick={profileViewOption}>Likes</div>
          </div>
          <div>{}</div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
