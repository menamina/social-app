import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import SendMsg from "./sendMsg.jsx";

function MsgOpened({ id, isBlocked }) {
  const { user } = useOutletContext();

  const [msgAPIError, setMsgsAPIError] = useState(null);
  const [msgs, setMsgs] = useState(null);
  const [otherUser, setOtherUser] = useState(null);

  const [openDeleteMsg, setOpenDeleteMsg] = useState(false);
  const [deleteMsgErr, setDeleteMsgErr] = useState(null);
  const [deleteClicked, setDeleteClicked] = useState(false);

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
          setOtherUser(data.otherUser);
        } catch (error) {
          setMsgsAPIError(error.errorMsg);
        }
      }
      get1to1Msgs();
    }, 2000);
    return () => clearInterval(interval);
  }, [id]);

  async function deleteMsg(msgID) {
    try {
    } catch (error) {
      setDeleteMsgErr(error.errorMsg);
    }
  }

  if (msgAPIError) {
    return <div>{msgAPIError}</div>;
  }

  if (!msgs) {
    return <div>loading..</div>;
  }

  return (
    <div className="msgOpened div">
      <div>
        <Link to={`http://localhost:5555/@${otherUser.username}`}>
          {" "}
          <img
            src={`${otherUser.pfp}`}
            alt={`${otherUser.username} profile pic`}
          />
        </Link>
      </div>
      <div className="renderedMsgs">
        {msgs && (
          <div>
            {msgs.map((msg) => {
              const isSent = msg.senderID === user.id;
              return (
                <div className={isSent ? "msgSent" : "msgReceived"}>
                  <div className="deleteMsg">
                    <div onClick={() => setOpenDeleteMsg(true)}>...</div>
                    {openDeleteMsg && (
                      <div onClick={() => setDeleteClicked(true)}>
                        delete for me
                      </div>
                    )}
                  </div>
                  <div>
                    {msg.image && (
                      <div>
                        <img src={`http://localhost:5555/img/${msg.image}`} />
                      </div>
                    )}
                    {msg.message && <div>{msg.message}</div>}
                  </div>
                  <div>{msg.createdAt}</div>
                </div>
              );
            })}
          </div>
        )}

        {deleteClicked && (
          <div>
            <div>Delete message</div>
            <div>Are you sure you want to delete this message?</div>
            <div>
              <div>delete for me</div>
              <div>cancel</div>
            </div>
          </div>
        )}

        {isBlocked ? (
          <div>
            <p>You cannot send messages to this user.</p>
          </div>
        ) : (
          <SendMsg to={otherUser} />
        )}
      </div>
    </div>
  );
}

export default MsgOpened;
