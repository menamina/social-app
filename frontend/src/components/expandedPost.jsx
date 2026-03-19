import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import PostCard from "./PostCard";

function ExpandedPost() {
  const {} = useOutletContext();

  const navigate = useNavigate();

  function navToFeed(postID) {
    console.log(postID);
    navigate(`http://localhost:5555/`);
  }

  return (
    <div className="expandedPost">
      <PostCard key={post.id} post={post} onDelete={navToFeed()} />
    </div>
  );
}

export default ExpandedPost;
