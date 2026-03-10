import { useState, useEffect } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import Nav from "./nav.jsx";

function Hub() {
  const { user, forYouFeed, setForYouFeed, forYouFeedErr, setForYouFeedErr } =
    useOutletContext();
  const [userProfile, setUserProfile] = useState(null);
  const [clickedOnPost, setClickedOnPost] = useState(null);
  const [navUserData, setNavUserData] = useState(null);

  useEffect(() => {
    async function fetchNavData() {
      try {
        const res = await fetch("http://localhost:5555/nav-data", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (data.navData) {
          setNavUserData(data.navData);
        }
      } catch (error) {
        console.error("Error fetching nav data:", error);
      }
    }

    fetchNavData();
  }, []);

  if (!navUserData) {
    return <div>Loading...</div>;
  }

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
