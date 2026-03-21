import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const [forYouFeed, setForYouFeed] = useState(null);
  const [forYouFeedErr, setForYouFeedErr] = useState(null);
  const [loading, setLoading] = useState(true);
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
          setLoading(false);
          navigate("/login", { replace: true });
          return;
        }
        setUser(data.user);
        setLoading(false);
        return;
      } catch (error) {
        setLoading(false);
        navigate("/login", { replace: true });
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

  if (loading) return null;

  return (
    <div>
      <Outlet
        context={{
          user,
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
