import { useState, useEffect } from "react";
import { OutletContext } from "react-dom";

function App() {
  const [user, setUser] = useState(null);
  const [forYouFeed, setForYouFeed] = useState(null);
  const [forYouFeedErr, setForYouFeedErr] = useState(null);

  useEffect(() => {
    async function checkIfUser() {
      try {
        const res = await fetch("http://localhost:5555/api/isAuth", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (res.status === 401) {
          return;
        }

        setUser(data.user);
      } catch (error) {
        return error;
        //fix later
      }
    }
    checkIfUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    async function loadUserContent() {
      try {
        const res = await fetch("http://localhost:5555/for-you-feed", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        setForYouFeed(data.allPosts);
      } catch (error) {
        setForYouFeedErr(error.errorMsg);
      }
    }
    loadUserContent();
  }, [user]);

  return <div></div>;
}

export default App;
