import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostCard from "./PostCard";

function ExpandedPost() {
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
    navigate("/");
  }

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="expandedPost">
      <div>
        <button onClick={() => navigate("/")}>← go back</button>
      </div>

      <PostCard
        post={post}
        onDelete={() => navToFeed(postId)}
      />

      {post.comments && post.comments.length > 0 && (
        <div className="commentsAsPostsSection">
          {post.comments.map((comment) => (
            <PostCard
              key={comment.id}
              post={comment}
              onClick={() => navigate(`/@${comment.user?.username}/comment/${comment.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ExpandedPost;
