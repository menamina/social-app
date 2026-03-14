import { useState } from "react";
import { useOutletContext } from "react-router-dom";

function MsgOpened({ id }) {
  const [msgAPIError, setMsgsAPIError] = useState(null);
  const [msgs, setMsgs] = useState(null);

  useEffect(() => {
    async function get1to1Msgs() {
      try {
        const res = await fetch(`http://localhost:5555/dms/${id}`, {
          method: "POST",
          credentials: "include",
        });

        const data = await res.json();
      } catch (error) {
        setMsgsAPIError(error.errorMsg);
      }
    }
    get1to1Msgs();
  }, []);
}

export default MsgOpened;
