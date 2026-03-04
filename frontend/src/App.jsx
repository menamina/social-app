import { useState, useEffect } from "react";
import { OutletContext } from "react-dom";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkIfUser() {
      //api for jwt;
    }
    checkIfUser();
  }, []);

  return <div></div>;
}

export default App;
