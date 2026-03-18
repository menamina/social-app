import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";

function MakeAPost() {
  return (
    <div className="makeAPost div">
      <div>
        <button>cancel</button>
        <div>new post</div>
        <img src="" alt="" />
      </div>
      <div></div>
      <div>
        <button>post</button>
      </div>
    </div>
  );
}

export default MakeAPost;
