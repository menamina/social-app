import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostCard from "./PostCard";

function ExpandedPost() {
  const { username, id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [postComments, setPostComments] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showOriginalPost, setShowOriginalPost] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(
          `http://localhost:5555/@${username}/post/${id}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await res.json();

        if (!res.ok) {
          setPost(null);
          setLoading(false);
          return;
        }

        setPost(data.post);
        setPostComments(data.post.commentReplies);

        if (data.post.commentOnPost) {
          setShowOriginalPost(data.post.commentOnPost);
        }

        setLoading(false);
        false;
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
    fetchPost();
  }, [username, id]);

  function updateCommentsUI(postId) {
    setPostComments((prev) => prev.filter((post) => post.id !== postId));
  }

  function updateOriginalPostUI() {
    setShowOriginalPost(null);
  }

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="outletHolderDiv">
      <div>
        <button onClick={() => navigate(-1)}>← go back</button>
      </div>

      <div>
        {showOriginalPost && (
          <PostCard
            post={showOriginalPost}
            onDelete={updateOriginalPostUI}
            onClick={() =>
              navigate(
                `/@${showOriginalPost.postedBy?.username}/post/${showOriginalPost.id}`,
              )
            }
          />
        )}
        {post && <PostCard post={post} onDelete={() => setPost(null)} />}
        {!post && <div>Post not found</div>}
      </div>

      {post.commentReplies && post.commentReplies.length > 0 && (
        <div className="commentsAsPostsSection">
          {postComments.map((comment) => (
            <PostCard
              key={comment.id}
              post={comment}
              onClick={() =>
                navigate(
                  `/@${comment.postedBy?.username}/comment/${comment.id}`,
                )
              }
              onDelete={updateCommentsUI}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ExpandedPost;
