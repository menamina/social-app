import { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import Nav from "./nav.jsx";

function Hub() {
  const { user, forYouFeed, setForYouFeed, forYouFeedErr, setForYouFeedErr } =
    useOutletContext();
  const [userProfile, setUserProfile] = useState(null);
  const [clickedOnPost, setClickedOnPost] = useState(null);

  const navUserData = {
    username: user.username,
    name: user.name,
    pfp: user.pfp,
  };

  return (
    <div>
      <Nav navUserData={navUserData} />
      <div className="outletDiv">
        <Outlet
          context={{
            user,
            userProfile,
            setUserProfile,
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
