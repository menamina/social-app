import { useState, useEffect } from "react";
import { OutletContext, useNavigate } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const [forYouFeed, setForYouFeed] = useState(null);
  const [forYouFeedErr, setForYouFeedErr] = useState(null);
  const navigate = useNavigate();

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
        const path = window.location.pathname;
        if (path === "/" || path === "/login" || path === "/signup") {
          navigate("/hub");
        }
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

  return (
    <div>
      <Outlet
        context={{
          user,
          setUser,
          forYouFeed,
          setForYouFeed,
          forYouFeedErr,
          setForYouFeedErr,
        }}
      />
    </div>
  );
}

export default App;
