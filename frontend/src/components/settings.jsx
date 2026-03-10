import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

function Settings() {
  const { userProfile, setUserProfile } = useOutletContext();
  const [viewOpt, setViewOpt] = useState("privacy");

  function changeViewOpt(option) {
    setViewOpt(option);
  }

  return (
    <div className="settingsDiv">
      <div>
        <div>
          <p>back</p>
          {/* change to back error */}
        </div>
        <div>Settings</div>
      </div>
      <div className="settingsFlexContainer">
        <div>
          <div onClick={() => changeViewOpt("privacy")}>Privacy</div>
          <div onClick={() => changeViewOpt("account")}>Account</div>
          <div onClick={() => changeViewOpt("help")}>Help</div>
        </div>
        <div>
          {viewOpt === "privacy" ? <div></div> : null}
          {viewOpt === "account" ? <div></div> : null}
          {viewOpt === "help" ? <div></div> : null}
        </div>
      </div>
    </div>
  );
}

export default Settings;
