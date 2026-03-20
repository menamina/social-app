import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostCard from "./PostCard";

function ExpandedPost() {
  const { username, postId } = useParams();

  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showOriginalPost, setShowOriginalPost] = useState(null);

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

        if (data.post.commentOnPost) {
          setShowOriginalPost(data.post.commentOnPost);
        }

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

      <div>
        {showOriginalPost && (
          <PostCard
            post={showOriginalPost}
            onDelete={() => navToFeed(postId)}
            onClick={() =>
              navigate(
                `/@${showOriginalPost.postedBy?.username}/post/${showOriginalPost.id}`,
              )
            }
          />
        )}
        <PostCard post={post} onDelete={() => navToFeed(postId)} />
      </div>

      {post.commentReplies && post.commentReplies.length > 0 && (
        <div className="commentsAsPostsSection">
          {post.commentReplies.map((comment) => (
            <PostCard
              key={comment.id}
              post={comment}
              onClick={() =>
                navigate(
                  `/@${comment.postedBy?.username}/comment/${comment.id}`,
                )
              }
              onDelete={() => navToFeed(postId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ExpandedPost;
