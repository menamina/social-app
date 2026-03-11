import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

function Profile() {
  const { userProfile, setUserProfile, navUserData, setNavUserData } =
    useOutletContext();

  useEffect(() => {
    async function refetchUserData() {
      try {
        const res = await fetch(
          `http://localhost:5555/@${navUserData.username}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await res.json();
        setUserProfile(data.viewThisUserProfile);
      } catch (error) {
        return error;
        //  fix later
      }
    }
    refetchUserData;
  }, []);
}

export default Profile;
