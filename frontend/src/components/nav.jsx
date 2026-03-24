import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import MakeAPost from "./makePost";

import koifish from "../../imgs/koi.png";
// import home from "../../imgs/";
import search from "../../imgs/search.svg";
import newpost from "../../imgs/post.png";
import dms from "../../imgs/letter.png";
import profile from "../../imgs/profile.svg";
import settings from "../../imgs/settings.png";

function Nav({ navUserData, setNavUserData }) {
  const { setForYouFeed } = useOutletContext();
  const [utilsToggle, setUtilsToggle] = useState(false);
  const [wannaMakeAPost, setWannaMakeAPost] = useState(false);
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
        nav("/login", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  }

  function openMakeAPostModal() {
    setWannaMakeAPost(true);
  }

  return (
    <div>
      <div className="logoIMG">
        <Link className="cursor-reg" to="/">
          <img src={koifish} alt="social media brand logo to go to home feed" />
        </Link>
      </div>

      <div className="navOpts">
        <div>
          <Link className="cursor-reg" to="/">
            <img src="" alt="home img to go to home feed" />
          </Link>
        </div>
        <div>
          <Link className="cursor-reg" to="/search">
            <img src={search} alt="search" />
          </Link>
        </div>
        <div>
          <img
            className="cursor-reg"
            src={newpost}
            alt="makeAPost"
            onClick={openMakeAPostModal}
          />
          {wannaMakeAPost && (
            <MakeAPost onClose={() => setWannaMakeAPost(false)} />
          )}
          {/* going to pop up as modal overlay */}
        </div>
        <div>
          <Link className="cursor-reg" to="/dms">
            <img src={dms} alt="dms" />
          </Link>
        </div>
        <div>
          <Link className="cursor-reg" to={`/@${navUserData?.username}`}>
            <img src={profile} alt="click to go to your profile" />
          </Link>
        </div>
      </div>

      <div className="openSettings">
        <div onClick={utilToggle}>
          <div className="cursor-reg">settings</div>
          <img src={settings} alt="open settings" />
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
