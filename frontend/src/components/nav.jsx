import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import MakeAPost from "./makePost";

import koifish from "../../imgs/koi.png";
import home from "../../imgs/home.svg";
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

  function closeUtil(e) {
    e.stopPropagation();
    setUtilsToggle(false);
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
    <div className="navie">
      <div className="logoIMG">
        <Link className="cursor-reg" to="/">
          <img
            className="brandLOGO"
            src={koifish}
            alt="social media brand logo to go to home feed"
          />
        </Link>
      </div>

      <div className="navOpts">
        <div>
          <Link className="cursor-reg" to="/">
            <img
              className="navIMG"
              src={home}
              alt="home img to go to home feed"
            />
          </Link>
        </div>
        <div>
          <Link className="cursor-reg" to="/search">
            <img className="navIMG" src={search} alt="search" />
          </Link>
        </div>
        <div>
          <img
            className="cursor-reg navIMG"
            src={newpost}
            alt="makeAPost"
            onClick={openMakeAPostModal}
          />
          {wannaMakeAPost && (
            <MakeAPost onClose={() => setWannaMakeAPost(false)} />
          )}
        </div>
        <div>
          <Link className="cursor-reg" to="/dms">
            <img className="navIMG navIMG-dms" src={dms} alt="dms" />
          </Link>
        </div>
        <div>
          <Link className="cursor-reg" to={`/${navUserData?.username}`}>
            <img
              className="navIMG"
              src={profile}
              alt="click to go to your profile"
            />
          </Link>
        </div>
      </div>

      <div className="openSettings">
        {utilsToggle ? (
          <div className="utilsOpen">
            <div className="utilWrapper" onClick={(e) => e.stopPropagation()}>
              <div className="cursor">
                <Link to="/settings" onClick={(e) => closeUtil(e)}>
                  Settings
                </Link>
              </div>
              <div className="cursor" onClick={(e) => closeUtil(e)}>
                Report a problem
              </div>
              <div className="cursor" onClick={logout}>
                Logout
              </div>
            </div>
          </div>
        ) : null}

        <div onClick={utilToggle} className="cursor-reg">
          <img className="navIMG" src={settings} alt="open settings" />
        </div>
      </div>
    </div>
  );
}

export default Nav;
