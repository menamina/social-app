import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

function MsgOpened({ id }) {
  const [msgAPIError, setMsgsAPIError] = useState(null);
  const [msgs, setMsgs] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      async function get1to1Msgs() {
        try {
          const res = await fetch(`http://localhost:5555/dms/${id}`, {
            method: "GET",
            credentials: "include",
          });

          const data = await res.json();
          setMsgs(data.one2one);
        } catch (error) {
          setMsgsAPIError(error.errorMsg);
        }
      }
      get1to1Msgs();
    }, 2000);
    return () => clearInterval(interval);
  }, [id]);

  if (msgAPIError) {
    return <div>{msgAPIError}</div>;
  }

  if (!msgs) {
    return <div>loading..</div>;
  }

  return <div className="msgOpened div"></div>;
}

export default MsgOpened;
