import { useState, useEffect } from "react";
import { OutletContext, useNavigate, Link } from "react-router-dom";

function Nav() {
  return (
    <div>
      <div className="logoIMG"></div>

      <div className="navOpts">
        <div>
          <Link to="/">
            {" "}
            <img src="" alt="home image for main feed" />
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
          <Link to={`/@${user.username}`}>
            {" "}
            <img src="" alt="your profile" />
          </Link>
        </div>
      </div>

      <div className="openSettings"></div>
    </div>
  );
}

export default Nav;
