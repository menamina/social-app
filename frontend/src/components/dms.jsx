import { useState, useEffect } from "react";
import MsgOpened from "./msgOpened";

function Dms() {
  const [getDmError, setGetDmError] = useState(null);
  const [queryErr, setQueryErr] = useState(null);
  const [noQRes, setNoQRes] = useState(null);

  const [sideBarDMS, setsideBarDMS] = useState(null);

  const [searchUserToMessage, setSearchUserToMessage] = useState(false);
  const [query, setQuery] = useState("");
  const [queryResult, setQueryResult] = useState([]);

  const [msgSearchOpen, setMsgSearchOpen] = useState(false);
  const [msgSearch, setMsgSearch] = useState("");
  const [msgSeachRes, setMsgSearchRes] = useState([]);

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
        setGetDmError(null);
      } catch (error) {
        setGetDmError(error.errorMsg);
      }
    }
    getsideBarDMS();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!query) {
        setQueryResult([]);
        setNoQRes(null);
        setQueryErr(null);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5555/dms/searchUser/${query}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await res.json();
        if (!res.ok) {
          setNoQRes("No users found with that name");
          setQueryErr(null);
          return;
        }
        setQueryResult(data.userSearchRes);
        setNoQRes(null);
        setQueryErr(null);
        return;
      } catch (error) {
        setQueryErr(error.errorMsg);
        setNoQRes(null);
        setQueryResult(null);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!msgSearch) {
        setMsgSearchOpen(false);
        setMsgSearchRes([]);
        return;
      }
      setMsgSearchOpen(true);
      try {
        const res = await fetch(
          `http://localhost:5555/dms/msgSearch/${msgSearch}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await res.json();
        if (!res.ok) {
          setNoQRes("No users found with that name");
          setQueryErr(null);
          return;
        }
        setMsgSearchRes(data.userSearchRes);
        return;
      } catch (error) {
        setQueryErr(error.errorMsg);
        setMsgSearchRes(null);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [msgSearch]);

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
      setSearchUserToMessage(false);
      setGetDmError(null);
      return;
    } catch (error) {
      setGetDmError(error.errorMsg);
    }
  }

  function clearSearchUserModal() {
    setSearchUserToMessage(false);
    setQueryResult(null);
  }

  if (!sideBarDMS) {
    return <div>loading..</div>;
  }

  return (
    <div className="outletHolderDiv">
      <div>
        <div>
          <div>
            <div>Chat</div>
            <div onClick={() => setSearchUserToMessage(true)}>new msg</div>
          </div>
          <div>
            <div>
              <input
                placeholder="search"
                aria-label="search in dms"
                value={msgSearch}
                onChange={(e) => setMsgSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="renderedChatsOnSide">
          {getDmError && <div>{getDmError}</div>}

          {msgSearchOpen ? (
            <div>
              {msgSeachRes &&
                msgSeachRes.map((obj) => (
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
          ) : (
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
            ))
          )}
        </div>
      </div>
      {openMsg && <MsgOpened id={openMsgWith} isBlocked={isBlocked} />}

      {searchUserToMessage ? (
        <div className="searchUserToDmModal">
          <div>
            <div>
              <div>New message</div>
              <div onClick={clearSearchUserModal}>X</div>
            </div>
            <div>
              <input
                placeholder="search username"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            {queryErr && <div>{queryErr}</div>}
            {noQRes && <div>{noQRes}</div>}
            {queryResult &&
              queryResult.map((result) => (
                <div key={result.id} onClick={() => checkBlockStat(result.id)}>
                  <div>
                    <img src={`${result.pfp}`} />
                  </div>
                  <div>
                    <p>{result.name}</p>
                    <p>{result.username}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
export default Dms;
