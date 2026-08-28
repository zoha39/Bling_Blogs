import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function BlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);

  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState("");

  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/blogs/${id}`);

        setBlog(response.data.blog);
      } catch (error) {
        console.error("Failed to fetch blog:", error);

        setError(error.response?.data?.message || "Failed to load this blog.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setCommentsLoading(true);
        setCommentError("");

        const response = await api.get(`/comments/${id}`);

        setComments(response.data.comments || []);
      } catch (error) {
        console.error("Failed to fetch comments:", error);

        setCommentError(
          error.response?.data?.message || "Failed to load comments.",
        );
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [id]);

  const isAuthor =
    user &&
    blog &&
    user.id &&
    blog.author?._id &&
    user.id.toString() === blog.author._id.toString();

  const handleSubmitComment = async (event) => {
    event.preventDefault();

    const trimmedComment = commentText.trim();

    if (!trimmedComment) {
      setCommentError("Comment cannot be empty.");
      return;
    }

    if (trimmedComment.length > 2000) {
      setCommentError("Comment cannot exceed 2000 characters.");
      return;
    }

    try {
      setSubmittingComment(true);
      setCommentError("");

      const response = await api.post(`/comments/${id}`, {
        content: trimmedComment,
      });

      setComments((previousComments) => [
        response.data.comment,
        ...previousComments,
      ]);

      setCommentText("");

      toast.success("Comment posted successfully!");
    } catch (error) {
      console.error("Failed to submit comment:", error);

      setCommentError(
        error.response?.data?.message ||
          "Failed to add comment. Please try again.",
      );
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);

      setComments((previousComments) =>
        previousComments.filter((comment) => comment._id !== commentId),
      );

      toast.success("Comment deleted successfully!");
    } catch (error) {
      console.error("Failed to delete comment:", error);

      const message =
        error.response?.data?.message ||
        "Failed to delete comment. Please try again.";

      setCommentError(message);
      toast.error(message);
    }
  };

  const handleEdit = () => {
    navigate(`/blogs/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setError("");

      await api.delete(`/blogs/${id}`);

      toast.success("Blog deleted successfully!");

      navigate("/library");
    } catch (error) {
      console.error("Delete blog error:", error);

      const message =
        error.response?.data?.message ||
        "Failed to delete this blog. Please try again.";

      setError(message);
      setShowDeleteConfirmation(false);

      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="page-loading">Loading blog...</div>;
  }

  if (error && !blog) {
    return (
      <div className="error-state">
        <p>{error}</p>

        <button type="button" onClick={() => navigate("/")}>
          Back Home
        </button>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  const publicationDate = new Date(blog.createdAt).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <>
      <article className="blog-page">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

        <header className="blog-page-header">
          <div className="blog-page-title-row">
            <h1>{blog.title}</h1>

            {isAuthor && (
              <div className="blog-owner-actions">
                <button type="button" onClick={handleEdit} disabled={deleting}>
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeleteConfirmation(true)}
                  disabled={deleting}
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className="blog-page-author">
            {blog.author?.profileImage ? (
              <img src={blog.author.profileImage} alt={blog.author.name} />
            ) : (
              <div className="author-image-fallback">
                {blog.author?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}

            <div>
              <p>{blog.author?.name}</p>
              <span>{publicationDate}</span>
            </div>
          </div>
        </header>

        {error && <p className="form-error">{error}</p>}

        <div
          className="blog-page-content"
          dangerouslySetInnerHTML={{
            __html: blog.content,
          }}
        />

        <section className="comments-section">
          <h2>Comments</h2>

          <form className="comment-form" onSubmit={handleSubmitComment}>
            <textarea
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Write a comment..."
              maxLength={2000}
              disabled={submittingComment}
            />

            <button
              type="submit"
              disabled={submittingComment || !commentText.trim()}
            >
              {submittingComment ? "Posting..." : "Comment"}
            </button>
          </form>

          {commentError && <p className="form-error">{commentError}</p>}

          {commentsLoading ? (
            <div className="comments-loading">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="comments-empty">
              <p>No comments yet.</p>
              <span>Be the first to comment.</span>
            </div>
          ) : (
            <div className="comments-list">
              {comments.map((comment) => (
                <article key={comment._id} className="comment-item">
                  <div className="comment-author">
                    {comment.author?.profileImage ? (
                      <img
                        src={comment.author.profileImage}
                        alt={comment.author.name}
                        className="comment-author-image"
                      />
                    ) : (
                      <div className="comment-author-fallback">
                        {comment.author?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}

                    <div className="comment-author-info">
                      <strong>{comment.author?.name || "Unknown User"}</strong>

                      <span>
                        {new Date(comment.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="comment-content">
                    <p>{comment.content}</p>

                    {user &&
                      comment.author?._id &&
                      user.id.toString() === comment.author._id.toString() && (
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          Delete
                        </button>
                      )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </article>

      {showDeleteConfirmation && (
        <div className="confirmation-backdrop">
          <div
            className="confirmation-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
          >
            <h2 id="delete-dialog-title">Delete blog?</h2>

            <p>
              Are you sure you want to delete this blog? This action cannot be
              undone.
            </p>

            <div className="confirmation-actions">
              <button
                type="button"
                onClick={() => setShowDeleteConfirmation(false)}
                disabled={deleting}
              >
                Cancel
              </button>

              <button type="button" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
