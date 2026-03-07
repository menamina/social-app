import { useState, useEffect } from "react";
import { OutletContext } from "react-dom";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkIfUser() {
      try {
        const res = await fetch("http://localhost:5555/api/isAuth", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (!res.status === 401) {
          return;
          //fix later
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

    loadUserContent() => {
          try {
      const res = await fetch("", {
        method:
      })
    } catch (error) {
      return error;
      //fix later
    }

    }
    loadUserContent()
  }, [user]);

  return <div></div>;
}

export default App;
