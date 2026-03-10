import { useState } from "react";
import { Link } from "react-router-dom";

function Nav({ navUserData }) {
  const [utilsToggle, setUtilsToggle] = useState(false);

  function utilToggle() {
    setUtilsToggle((prev) => !prev);
  }

  function logout() {}

  return (
    <div>
      <div className="logoIMG"></div>

      <div className="navOpts">
        <div>
          <Link to="/">
            {" "}
            <img
              src={`http://localhost:5555/pfpIMG/${}`}
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
