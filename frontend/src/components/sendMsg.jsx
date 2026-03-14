import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SendMsg({ otherUser }) {
  const [msg, setMsg] = useState("");
  const [imgs, setImgs] = useState([]);
  const [sendMsgErr, setSendMsgErr] = useState(null);
  const [sendMsgAPIErr, setSendMsgAPIErr] = useState(null);

  async function sendMsg() {
    try {
      const res = await await fetch("http://localhost:5555/send-msg", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          sendToID: otherUser.id,
          msg: msg ? msg : null,
          files: imgs ? imgs : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSendMsgErr(data.errorMsg);
        setSendMsgAPIErr(null);
        return;
      }
    } catch (error) {
      setSendMsgAPIErr(error.errorMsg);
      setSendMsgErr(null);
    }
  }

  return (
    <div className="sendMsg div">
      <div>
        <input
          aria-label={`send message to ${otherUser.username} `}
          placeholder="Send a message"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        ></input>
      </div>
      <div>
        <input
          aria-label={`send image to ${otherUser.username} `}
          value={imgs}
          type="files"
        ></input>
      </div>
      <div>
        <button onClick={sendMsg}>send</button>
      </div>
    </div>
  );
}
export default SendMsg;
