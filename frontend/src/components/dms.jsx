import { useState, useEffect } from "react";
import MsgOpened from "./msgOpened";

// add a search for user functionality IN the dms
// when adding message from here check blocked

function Dms() {
  const [getDmError, setGetDmError] = useState(null);
  const [sideBarDMS, setsideBarDMS] = useState(null);
  const [openMsg, setOpenMsg] = useState(false);
  const [openMsgWith, setOpenMsgWith] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    async function getsideBarDMS() {
      try {
        const res = await fetch("http://localhost:5555/dms", {
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

  async function checkBlockStat(id) {
    try {
      const res = await fetch("http://localhost:5555/check-block-status", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otherUserID: id }),
      });

      const data = await res.json();
      setIsBlocked(data.isBlocked);
      setOpenMsgWith(id);
      setOpenMsg(true);
    } catch (error) {
      setGetDmError(error.errorMsg);
    }
  }

  if (!sideBarDMS) {
    return <div>loading..</div>;
  }

  return (
    <div className="dms div">
      {getDmError && <div>{getDmError}</div>}
      <div>
        {sideBarDMS &&
          sideBarDMS.map((obj) => (
            <div key={obj.id} onClick={() => checkBlockStat(obj.id)}>
              <div>
                <img src={`${obj.pfp}`} />
              </div>
              <div>
                <p>{obj.name}</p>
                <p>{obj.username}</p>
              </div>
            </div>
          ))}
      </div>
      {openMsg && <MsgOpened id={openMsgWith} isBlocked={isBlocked} />}
    </div>
  );
}
export default Dms;
