import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import PostCard from "./PostCard";

function ExpandedPost() {
  const { user } = useOutletContext();
  const { username, postId } = useParams();

  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(
          `http://localhost:5555/@${username}/post/${postId}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await res.json();
        setPost(data.post);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
    fetchPost();
  }, [username, postId]);

  function navToFeed(postID) {
    console.log(postID);
    navigate(`http://localhost:5555/`);
  }

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="expandedPost">
      <PostCard
        key={postId}
        post={post}
        onDelete={() => navToFeed(postId)}
        showPostComments={true}
      />
    </div>
  );
}

export default ExpandedPost;
