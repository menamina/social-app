import { useState, useEffect } from "react";
import { OutletContext, useNavigate } from "react-router-dom";
import Nav from "./nav.jsx";

// this is where i put in all components
// put loaded feed here + mini profile view

function Hub() {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    async function fetchThisUsersProfile() {
      const res = await fetch();

      const data = await res.json();

      if (data.viewThisUserProfile) {
        setUserProfile(data.viewThisUserProfile);
      }
    }
    fetchThisUsersProfile();
  }, []);

  return (
    <div>
      <Nav />
      {/* context is where it will load whatever is clicked from nav */}
      <div className="outletDiv">
        <Outlet
          context={{
            userProfile,
          }}
        />
      </div>
    </div>
  );
}

export default Hub;
