import { useState, useEffect } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import Nav from "./nav.jsx";

function Hub() {
  const { user, forYouFeed, setForYouFeed, forYouFeedErr, setForYouFeedErr } =
    useOutletContext();
  const [userProfile, setUserProfile] = useState(null);
  const [clickedOnPost, setClickedOnPost] = useState(null);

  useEffect(() => {
    async function fetchThisUsersProfile() {
      const res = await fetch(`http://localhost:5555/@${user.username}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (data.viewThisUserProfile) {
        setUserProfile(data.viewThisUserProfile);
      }
    }
    fetchThisUsersProfile();
  }, [user.username]);

  return (
    <div>
      <Nav />
      <div className="outletDiv">
        <Outlet
          context={{
            user,
            userProfile,
            forYouFeed,
            setForYouFeed,
            forYouFeedErr,
            setForYouFeedErr,
            clickedOnPost,
            setClickedOnPost,
          }}
        />
      </div>
    </div>
  );
}

export default Hub;
