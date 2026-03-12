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
  const [blockedUsers, setBlockedUsers] = useState([]);

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
            setName(data.viewThisUserProfile.name);
            setUsername(data.viewThisUserProfile.username);
            setEmail(data.viewThisUserProfile.email);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setName(userProfile.name);
        setUsername(userProfile.username);
        setEmail(userProfile.email);
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [user]);

  function changeViewOpt(option) {
    setViewOpt(option);
  }

  async function toggledropDown(option) {
    if (dropDown === option) {
      setdropDown(null);
    } else {
      setdropDown(option);

      try {
        const res = await fetch("http://localhost:5555/blocked-users", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.blockedUsers) {
          setBlockedUsers(data.blockedUsers);
        }
      } catch (error) {
        console.error("Error fetching blocked users:", error);
      }
    }
  }

  async function handleUnblock(userId) {
    try {
      const res = await fetch(`http://localhost:5555/unblock/${userId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ unblockThemID: userId }),
      });

      const data = await res.json();

      if (data.success) {
        setBlockedUsers(blockedUsers.filter((user) => user.id !== userId));
        alert("User unblocked successfully");
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      alert("Failed to unblock user");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("email", email);
    if (profilePicture) {
      formData.append("pfp", profilePicture);
    }

    try {
      const res = await fetch("http://localhost:5555/update-profile", {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setUserProfile({
          ...userProfile,
          name,
          username,
          email,
        });
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating profile");
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
                  onClick={() => toggledropDown("blocked")}
                  className="privacyHeader"
                >
                  Blocked accounts
                </div>
                {dropDown === "blocked" ? (
                  <div className="privacyContent">
                    {blockedUsers.length === 0 ? (
                      <p>No blocked accounts</p>
                    ) : (
                      <div className="blockedUsersList">
                        {blockedUsers.map((blockedUser) => (
                          <div key={blockedUser.id} className="blockedUserItem">
                            <img
                              src={`http://localhost:5555/pfpIMG/${blockedUser.pfp}`}
                              alt={blockedUser.username}
                              className="blockedUserPfp"
                            />
                            <div className="blockedUserInfo">
                              <p className="blockedUserName">
                                {blockedUser.name}
                              </p>
                              <p className="blockedUserUsername">
                                @{blockedUser.username}
                              </p>
                            </div>
                            <button
                              onClick={() => handleUnblock(blockedUser.id)}
                              className="unblockButton"
                            >
                              Unblock
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
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
          {viewOpt === "help" ? (
            <div>
              <div>Send us a message</div>
              <form>
                <div>
                  <label>Email:</label>
                  <input />
                </div>
                <div>
                  <label>Message:</label>
                  <input />
                </div>
                <div>
                  <button>submit</button>
                </div>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Settings;
