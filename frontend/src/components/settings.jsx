import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

function Settings() {
  const { user, userProfile, setUserProfile } = useOutletContext();
  const [viewOpt, setViewOpt] = useState("privacy");
  const [dropDown, setdropDown] = useState(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserProfile() {
      if (!userProfile) {
        try {
          const res = await fetch(`http://localhost:5555/@${user.username}`, {
            method: "GET",
            credentials: "include",
          });

          const data = await res.json();

          if (data.viewThisUserProfile) {
            setUserProfile(data.viewThisUserProfile);
            setName(data.viewThisUserProfile.name || "");
            setUsername(data.viewThisUserProfile.username || "");
            setEmail(data.viewThisUserProfile.email || "");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setName(userProfile.name || "");
        setUsername(userProfile.username || "");
        setEmail(userProfile.email || "");
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [user.username, userProfile, setUserProfile]);

  function changeViewOpt(option) {
    setViewOpt(option);
  }

  function toggledropDown(option) {
    if (dropDown === option) {
      setdropDown(null);
    } else {
      setdropDown(option);
    }
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

  if (loading) {
    return <div>Loading profile...</div>;
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
            <div className="privacySettings">
              <div className="dropDownOpt">
                <div
                  onClick={() => toggledropDown("status")}
                  className="privacyHeader"
                >
                  Status
                </div>
                {dropDown === "status" ? (
                  <div className="privacyContent">
                    {/* Add status options here */}
                    <p>Account status settings</p>
                  </div>
                ) : null}
              </div>

              <div className="dropDownOpt">
                <div
                  onClick={() => toggledropDown("blocked")}
                  className="privacyHeader"
                >
                  Blocked accounts
                </div>
                {dropDown === "blocked" ? (
                  <div className="privacyContent">
                    {/* Add blocked accounts list here */}
                    <p>List of blocked accounts</p>
                  </div>
                ) : null}
              </div>
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
