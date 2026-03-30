import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import SendMsg from "./sendMsg.jsx";

function MsgOpened({ id, isBlocked }) {
  const { user } = useOutletContext();

  const [msgAPIError, setMsgsAPIError] = useState(null);
  const [msgs, setMsgs] = useState(null);
  const [otherUser, setOtherUser] = useState(null);

  const [openDeleteMsgID, setOpenDeleteMsgID] = useState(null);
  const [deleteMsgErr, setDeleteMsgErr] = useState(null);
  const [deleteClicked, setDeleteClicked] = useState(false);
  const [deleteThisMsgID, setDeleteThisMsgID] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function get1to1Msgs() {
      try {
        const res = await fetch(`http://localhost:5555/dms/${id}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        console.log("data from msgOpened:", data);
        setMsgs(data.one2one);
        setOtherUser(data.otherUser);
      } catch (error) {
        setMsgsAPIError(error.errorMsg);
      }
    }

    get1to1Msgs();
    const interval = setInterval(get1to1Msgs, 20000);
    return () => clearInterval(interval);
  }, [id]);

  function cancelMsgDelete() {
    setDeleteClicked(false);
    setDeleteThisMsgID(null);
    setOpenDeleteMsgID(null);
  }

  function deleteMsgID(id) {
    setDeleteClicked(true);
    setDeleteThisMsgID(id);
    setOpenDeleteMsgID(null);
  }

  async function deleteMsg() {
    setIsDeleting(true);
    try {
      const res = await fetch("http://localhost:5555/deleteMsg", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deleteThisMsgID: deleteThisMsgID,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setDeleteMsgErr(data.errorMsg);
      } else {
        setDeleteClicked(false);
        setDeleteThisMsgID(null);
        setDeleteMsgErr(null);
      }
    } catch (error) {
      setDeleteMsgErr(error.errorMsg || "Failed to delete message");
      setDeleteClicked(false);
      setDeleteThisMsgID(null);
    } finally {
      setIsDeleting(false);
    }
  }

  if (msgAPIError) {
    return <div>{msgAPIError}</div>;
  }

  return (
    <div className="msgOpenedDiv">
      {otherUser && (
        <div className="msgOpenedHeader">
          <Link to={`/${otherUser.username}`} className="msgOpenedUserLink">
            <img
              className="msgOpenedPFP"
              src={`http://localhost:5555/pfpIMG/${otherUser.profile?.pfp || "default-png.jpg"}`}
              alt={`${otherUser.username} profile pic`}
            />
            <div className="msgOpenedUserInfo">
              <div className="msgOpenedName">{otherUser.name}</div>
              <div className="msgOpenedUsername">@{otherUser.username}</div>
            </div>
          </Link>
        </div>
      )}
      <div className="renderedMsgs">
        {msgs && (
          <div className="msgsContainer">
            {msgs.map((msg) => {
              const isSent = msg.senderID === user.id;
              return (
                <div
                  key={msg.id}
                  className={isSent ? "msgBubble msgSent" : "msgBubble msgReceived"}
                >
                  <div className="msgOptions">
                    <div
                      className="msgMenuBtn"
                      onClick={() =>
                        setOpenDeleteMsgID(
                          openDeleteMsgID === msg.id ? null : msg.id,
                        )
                      }
                    >
                      ...
                    </div>
                    {openDeleteMsgID === msg.id && (
                      <div className="msgDeleteOption" onClick={() => deleteMsgID(msg.id)}>
                        delete for me
                      </div>
                    )}
                  </div>
                  <div className="msgContent">
                    {msg.images && msg.images.length > 0 && (
                      <div className="msgImages">
                        {msg.images.map((image, index) => (
                          <img
                            key={index}
                            src={`http://localhost:5555/img/${image}`}
                            alt={`message attachment ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                    {msg?.message && <div className="msgText">{msg?.message}</div>}
                  </div>
                  <div className="msgTime">{msg?.createdAt}</div>
                </div>
              );
            })}
          </div>
        )}

        {deleteMsgErr && <div className="error">{deleteMsgErr}</div>}

        {deleteClicked && (
          <>
            <div className="modal-backdrop" onClick={cancelMsgDelete}></div>
            <div className="modal-content">
              <div>Delete message</div>
              <div>Are you sure you want to delete this message?</div>
              <div>
                <div
                  onClick={isDeleting ? null : deleteMsg}
                  className={isDeleting ? "disabled" : ""}
                >
                  {isDeleting ? "Deleting..." : "delete for me"}
                </div>
                <div
                  onClick={isDeleting ? null : cancelMsgDelete}
                  className={isDeleting ? "disabled" : ""}
                >
                  cancel
                </div>
              </div>
            </div>
          </>
        )}

        {isBlocked ? (
          <div>
            <p>You cannot send messages to this user.</p>
          </div>
        ) : (
          <SendMsg otherUser={otherUser} />
        )}
      </div>
    </div>
  );
}

export default MsgOpened;
