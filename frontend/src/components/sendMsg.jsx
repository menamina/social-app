import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SendMsg({ otherUser }) {
  const [msg, setMsg] = useState("");
  const [imgs, setImgs] = useState([]);
  const [sendMsgErr, setSendMsgErr] = useState(null);
  const [sendMsgAPIErr, setSendMsgAPIErr] = useState(null);

  async function sendMsg() {
    try {
      const formData = new FormData();
      formData.append("sendToID", otherUser.id);
      formData.append("msg", msg || "");

      if (imgs && imgs.length > 0) {
        for (let i = 0; i < imgs.length; i++) {
          formData.append("files", imgs[i]);
        }
      }

      const res = await fetch("http://localhost:5555/send-msg", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setSendMsgErr(data.errorMsg);
        setSendMsgAPIErr(null);
        return;
      }

      setMsg("");
      setImgs([]);
      setSendMsgErr(null);
      setSendMsgAPIErr(null);
    } catch (error) {
      setSendMsgAPIErr(error.errorMsg);
      setSendMsgErr(null);
    }
  }

  return (
    <div className="sendMsg div">
      <div>
        <input
          aria-label={`send message to ${otherUser?.username} `}
          placeholder="Send a message"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        ></input>
      </div>

      {imgs.length > 0 && (
        <div className="imagePreviewContainer">
          {imgs.map((file, index) => (
            <div key={index} className="imagePreview">
              <img src={URL.createObjectURL(file)} alt="preview" />
              <button
                type="button"
                onClick={() => setImgs(imgs.filter((_, i) => i !== index))}
                className="removeImageBtn cursor-reg"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <input
          aria-label={`send image to ${otherUser?.username} `}
          onChange={(e) => setImgs(Array.from(e.target.files))}
          type="file"
          multiple
        ></input>
      </div>
      <div>
        <button onClick={sendMsg}>send</button>
      </div>
    </div>
  );
}
export default SendMsg;
