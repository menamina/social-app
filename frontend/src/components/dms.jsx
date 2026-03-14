import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MsgOpened from "./msgOpened";

// add a search for user functionality IN the dms
// when adding message from here check blocked

function Dms() {
  const [getDmError, setGetDmError] = useState(null);
  const [sideBarDMS, setsideBarDMS] = useState(null);

  useEffect(() => {
    async function getsideBarDMS() {
      try {
        const res = await fetch("http://localhost:5555/logout", {
          method: "POST",
          credentials: "include",
        });

        const data = await res.json();
        setsideBarDMS(data.sideBarDMS);
      } catch (error) {
        setGetDmError(error.errorMsg);
      }
    }
    getsideBarDMS();
  }, []);

  if (!sideBarDMS) {
    return <div>loading..</div>;
  }

  return (
    <div className="dms div">
      {getDmError && <div>{getDmError}</div>}
      <div>
        {sideBarDMS &&
          sideBarDMS.map((obj) => {
            <div onClick>
              <div>
                <img src={`${obj.pfp}`} />
              </div>
              <div>
                <p>{obj.name}</p>
                <p>{obj.username}</p>
              </div>
            </div>;
          })}
      </div>
      <MsgOpened />
    </div>
  );
}
export default Dms;
