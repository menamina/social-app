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
          method: "GET",
          credentials: "include",
        });

        if (res.status === 403) {
          setsideBarDMS(null);
          return;
        }

        const data = await res.json();
        setsideBarDMS(data.sideBarDMS);
        setGetDmError(null);
        return;
      } catch (error) {
        setGetDmError(error.errorMsg);
        setsideBarDMS(null);
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
          `http://localhost:5555/dms/search/user?query=${encodeURIComponent(query)}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await res.json();
        console.log("DM Search response:", data);
        console.log("Response status:", res.status);
        console.log("Response keys:", Object.keys(data));
        console.log("userSearchRes:", data.userSearchRes);
        console.log("Has message?:", data.message);

        if (!res.ok) {
          setNoQRes("No users found with that name");
          setQueryErr(null);
          setQueryResult(null);
          return;
        }

        if (data.userSearchRes && data.userSearchRes.length > 0) {
          setQueryResult(data.userSearchRes);
          setNoQRes(null);
          setQueryErr(null);
        } else {
          setNoQRes("No users found");
          setQueryResult(null);
          setQueryErr(null);
        }
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

  async function checkBlockStat(e, id) {
    e.stopPropagation();
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

  function userSearchXClicked(e) {
    e.stopPropagation();
    setSearchUserToMessage(false);
    setQueryResult(null);
  }

  function removeUserToSearchModal(e) {
    e.stopPropagation();
    setSearchUserToMessage(false);
    setQueryResult(null);
  }

  return (
    <div className="outletHolderDiv dms">
      <div className="leftOfDM">
        <div className="dmHeader">
          <h2>Chat</h2>
          <button onClick={() => setSearchUserToMessage(true)}>+</button>
        </div>

        <div className="renderedChatsOnSide">
          {getDmError && <div>{getDmError}</div>}
          <div>
            <div>
              <input
                className="msgSearchDM"
                placeholder="search in dms"
                aria-label="search in dms"
                value={msgSearch}
                onChange={(e) => setMsgSearch(e.target.value)}
              />
            </div>
          </div>
          {msgSearchOpen ? (
            <div className="msgSearchResults">
              {msgSeachRes &&
                msgSeachRes?.map((obj) => (
                  <div key={obj.id} className="dmUserCard" onClick={(e) => checkBlockStat(e, obj.id)}>
                    <div className="dmUserPFP">
                      <img src={`http://localhost:5555/pfpIMG/${obj.pfp || "default-png.jpg"}`} />
                    </div>
                    <div className="dmUserInfo">
                      <p className="dmUserName">{obj.name}</p>
                      <p className="dmUsername">@{obj.username}</p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="renderedDMSideDiv">
              {!sideBarDMS && (
                <div className="noChats">it's kinda lonely here..</div>
              )}
              {sideBarDMS &&
                sideBarDMS?.map((obj) => (
                  <div key={obj.id} className="dmUserCard" onClick={(e) => checkBlockStat(e, obj.id)}>
                    <div className="dmUserPFP">
                      <img src={`http://localhost:5555/pfpIMG/${obj.pfp || "default-png.jpg"}`} />
                    </div>
                    <div className="dmUserInfo">
                      <p className="dmUserName">{obj.name}</p>
                      <p className="dmUsername">@{obj.username}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="rightOfDM">
        {!openMsg ? (
          <div className="wannaMsgSomeone">
            <h1>Wanna msg someone?</h1>
            <div>start one today</div>
            <button onClick={() => setSearchUserToMessage(true)}>
              new chat
            </button>
          </div>
        ) : (
          <div className="msgOpened">
            <MsgOpened id={openMsgWith} isBlocked={isBlocked} />
          </div>
        )}
      </div>

      {searchUserToMessage ? (
        <div
          className="searchUserToDmModal"
          onClick={(e) => {
            removeUserToSearchModal(e);
          }}
        >
          <div className="searchwrapper" onClick={(e) => e.stopPropagation()}>
            <div>
              <h2>New message</h2>
              <h3 onClick={(e) => userSearchXClicked(e)}>X</h3>
            </div>
            <div>
              <input
                className="userSearchInput"
                placeholder="search username"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="userSearchRes">
              {queryErr && <div>{queryErr}</div>}
              {noQRes && <div>{noQRes}</div>}
              {queryResult &&
                queryResult?.map((result) => (
                  <div
                    key={result.id}
                    onClick={(e) => checkBlockStat(e, result?.id)}
                  >
                    <div>
                      <img
                        src={`http://localhost:5555/pfpIMG/${result?.profile?.pfp || "default-png.jpg"}`}
                      />
                    </div>
                    <div>
                      <p>{result?.name}</p>
                      <p>{result?.username}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
export default Dms;
