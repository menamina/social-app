import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

function Profile() {
  const { userProfile, setUserProfile } = useOutletContext();

  useEffect(() => {
    async function refetchUserData(id) {
      try {
        const res = await fetch(`http://localhost:5555/${id}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setUserProfile(data.userProf);
      } catch (error) {
        return error;
        //  fix later
      }
    }
    refetchUserData;
  }, []);
}

export default Profile;
