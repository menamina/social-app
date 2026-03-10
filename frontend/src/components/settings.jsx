import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

function Settings() {
  const { userProfile, setUserProfile } = useOutletContext();
  const [viewOpt, setViewOpt] = useState("privacy");
  const [name, setName] = useState(userProfile?.name || "");
  const [username, setUsername] = useState(userProfile?.username || "");
  const [email, setEmail] = useState(userProfile?.email || "");
  const [profilePicture, setProfilePicture] = useState(null);

  function changeViewOpt(option) {
    setViewOpt(option);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("email", email);
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }
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
          {viewOpt === "privacy" ? (
            <div>
              <div>Status</div>
              <div>Blocked accounts</div>
              {/* drop downs for opts */}
            </div>
          ) : null}
          {viewOpt === "account" ? (
            <div className="accountSettings">
              <h3>Update Profile</h3>
              <form onSubmit={handleSubmit}>
                <div className="formGroup">
                  <label htmlFor="profilePicture">Profile Picture</label>
                  <input
                    type="file"
                    id="profilePicture"
                    name="profilePicture"
                    accept="image/*"
                    onChange={(e) => setProfilePicture(e.target.files[0])}
                  />
                </div>

                <div className="formGroup">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                  />
                </div>

                <div className="formGroup">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                  />
                </div>

                <div className="formGroup">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                  />
                </div>

                <button type="submit" className="saveButton">
                  Save Changes
                </button>
              </form>
            </div>
          ) : null}
          {viewOpt === "help" ? <div></div> : null}
        </div>
      </div>
    </div>
  );
}

export default Settings;
