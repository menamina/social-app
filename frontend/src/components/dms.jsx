import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// add a search for user functionality IN the dms
// when adding message from here check blocked

function Dms() {
  const [getDmError, setGetDmError] = useState(null);

  useEffect(() => {
    async function getDmList() {
      try {
      } catch (error) {
        setGetDmError(error.errorMsg);
      }
    }
    getDmList();
  }, []);
}
export default Dms;
