import { useState, useEffect } from "react";
import MsgOpened from "./msgOpened";

function Dms() {
  const [getDmError, setGetDmError] = useState(null);
  const [queryErr, setQueryErr] = useState(null)
  const [noQRes, setNoQRes] = useState(null)

  const [sideBarDMS, setsideBarDMS] = useState(null);

  const [query, setQuery] = useState("");
  const [queryResult, setQueryResult] = useState([]);

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
        setGetDmError(null)
      } catch (error) {
        setGetDmError(error.errorMsg);
      }
    }
    getsideBarDMS();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {

      try {

      const res = await fetch("http://localhost:5555/dms/search", {
        method: "GET",
        credentials: "include",
        body: JSON.stringify({
          query,
        }),
      });

      const data = await res.json();
      if (!res.ok){
        setNoQRes(null)
        setQueryErr(null)
        return
      }
      setQueryResult(data.userSearchRes)
      return
    } catch(error) {
      setQueryErr(error.errorMsg)
    }


    return () => clearTimeout(timeout);
  }, [query]);

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
      setGetDmError(null)
      return
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
        <div>
          <div>
            <div>Chat</div>
            <div>new msg</div>
          </div>
          <div>
            <div><input placeholder="search" aria-label="search in dms" value={msgSearch} onChange={(e) => setMsgSearch(e.target.value)}/></div>
          </div>
        </div>

        <div className="renderedChatsOnSide">
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
      </div>
      {openMsg && <MsgOpened id={openMsgWith} isBlocked={isBlocked} />}
    </div>
  );
}
export default Dms;
