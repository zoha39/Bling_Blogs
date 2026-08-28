import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function BlogCard({ blog }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [liked, setLiked] = useState(
    user
      ? blog.likes?.some((userId) => userId.toString() === user.id.toString())
      : false,
  );

  const [likeCount, setLikeCount] = useState(blog.likes?.length || 0);
  const [liking, setLiking] = useState(false);

  const [likeError, setLikeError] = useState("");

  const handleCardClick = () => {
    navigate(`/blogs/${blog._id}`);
  };

  const handleInteraction = (event) => {
    event.stopPropagation();
  };

  const handleLike = async (event) => {
    event.stopPropagation();

    if (!user) {
      navigate("/auth");
      return;
    }

    if (liking) {
      return;
    }

    try {
      setLiking(true);
      setLikeError("");

      const response = await api.post(`/blogs/${blog._id}/like`);

      setLiked(response.data.liked);
      setLikeCount(response.data.likeCount);
    } catch (error) {
      console.error("Failed to update like:", error);

      if (error.response?.status === 401) {
        navigate("/auth");
        return;
      }

      setLikeError(
        error.response?.data?.message ||
          "Failed to update like. Please try again.",
      );
    } finally {
      setLiking(false);
    }
  };

  const handleComment = (event) => {
    event.stopPropagation();

    navigate(`/blogs/${blog._id}`);
  };

  const firstImage = blog.images?.[0]?.url;

  const publicationDate = new Date(blog.createdAt).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  return (
    <article
      className="blog-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
    >
      <div className="blog-card-image">
        {firstImage ? (
          <img src={firstImage} alt={blog.images?.[0]?.alt || blog.title} />
        ) : (
          <div className="blog-card-image-fallback">BLING BLOGS</div>
        )}
      </div>

      <div className="blog-card-content">
        <div className="blog-card-author">
          {blog.author?.profileImage ? (
            <img src={blog.author.profileImage} alt={blog.author.name} />
          ) : (
            <div className="author-image-fallback">
              {blog.author?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          <div>
            <p className="author-name">
              {blog.author?.name || "Unknown author"}
            </p>

            <p className="publication-date">{publicationDate}</p>
          </div>
        </div>

        <h2 className="blog-card-title">{blog.title}</h2>

        <div className="blog-card-excerpt">{getExcerpt(blog.content)}</div>

        <div className="blog-card-actions" onClick={handleInteraction}>
          <button
            type="button"
            onClick={handleLike}
            disabled={liking}
            aria-label={liked ? "Unlike blog" : "Like blog"}
          >
            {liked ? "♥" : "♡"} {likeCount}
          </button>

          <button
            type="button"
            onClick={handleComment}
            aria-label="View comments"
          >
            💬
          </button>
        </div>

        {likeError && <p className="form-error">{likeError}</p>}
      </div>
    </article>
  );
}

function getExcerpt(html) {
  if (!html) {
    return "";
  }

  const temporaryElement = document.createElement("div");
  temporaryElement.innerHTML = html;

  const text = temporaryElement.textContent || "";

  return text.length > 180 ? `${text.slice(0, 180)}...` : text;
}
