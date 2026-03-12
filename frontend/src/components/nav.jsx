import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

function Nav({ navUserData, setNavUserData }) {
  const { setForYouFeed, setUserProfile } = useOutletContext();
  const [utilsToggle, setUtilsToggle] = useState(false);
  const nav = useNavigate();

  function utilToggle() {
    setUtilsToggle((prev) => !prev);
  }

  async function logout() {
    try {
      const res = await fetch("http://localhost:5555/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.status === 200) {
        setNavUserData(null);
        setForYouFeed(null);
        setUserProfile(null);
        nav("/");
      }
    } catch (error) {
      alert("Error logging out:", error);
    }
  }

  return (
    <div>
      <div className="logoIMG"></div>

      <div className="navOpts">
        <div>
          <Link to="/">
            {" "}
            <img
              src={`http://localhost:5555/pfpIMG/${navUserData.profile?.pfp || navUserData.pfp}`}
              alt="home image for main feed"
            />
          </Link>
        </div>
        <div>
          <Link to="/search">
            {" "}
            <img src="" alt="search" />
          </Link>
        </div>
        <div>
          // new post pop up ... make component and render here(?)
          {/* <Link to="/new-post">
            {" "}
            <img src="" alt="new post" />
          </Link> */}
        </div>
        <div>
          <Link to={`/@${navUserData.username}`}>
            {" "}
            <img src="" alt="your profile" />
          </Link>
        </div>
      </div>

      <div className="openSettings">
        <div onClick={utilToggle}>
          <img src="" alt="" />
        </div>

        {utilsToggle ? (
          <div className="utilsOpen">
            <div>
              <Link to="/settings">Settings</Link>
            </div>
            <div>Report a problem</div>
            <div onClick={logout}>Logout</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Nav;
