import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import toast from "react-hot-toast";

export default function LibraryPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("your-list");

  const [blogs, setBlogs] = useState([]);
  const [responses, setResponses] = useState([]);

  const [blogsLoading, setBlogsLoading] = useState(true);
  const [responsesLoading, setResponsesLoading] = useState(false);

  const [blogsError, setBlogsError] = useState("");
  const [responsesError, setResponsesError] = useState("");

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        setBlogsLoading(true);
        setBlogsError("");

        const response = await api.get("/blogs/my");

        setBlogs(response.data.blogs || []);
      } catch (error) {
        console.error("Failed to fetch my blogs:", error);

        setBlogsError(
          error.response?.data?.message || "Failed to load your blogs.",
        );
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchMyBlogs();
  }, []);

  useEffect(() => {
    if (activeTab !== "responses") {
      return;
    }

    const fetchResponses = async () => {
      try {
        setResponsesLoading(true);
        setResponsesError("");

        const response = await api.get("/comments/responses/me");

        setResponses(response.data.responses || []);
      } catch (error) {
        console.error("Failed to fetch responses:", error);

        setResponsesError(
          error.response?.data?.message || "Failed to load responses.",
        );
      } finally {
        setResponsesLoading(false);
      }
    };

    fetchResponses();
  }, [activeTab]);

  const handleDeleteBlog = async (blogId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/blogs/${blogId}`);

      setBlogs((previousBlogs) =>
        previousBlogs.filter((blog) => blog._id !== blogId),
      );
      toast.success("Blog deleted successfully.");
    } catch (error) {
      console.error("Failed to delete blog:", error);

      toast.error(
        error.response?.data?.message || "Failed to delete the blog.",
      );
    }
  };

  return (
    <section className="library-page">
      <div className="library-header">
        <h1>Your Library</h1>
      </div>

      <div className="library-tabs">
        <button
          type="button"
          className={
            activeTab === "your-list" ? "library-tab active" : "library-tab"
          }
          onClick={() => setActiveTab("your-list")}
        >
          Your List
        </button>

        <button
          type="button"
          className={
            activeTab === "responses" ? "library-tab active" : "library-tab"
          }
          onClick={() => setActiveTab("responses")}
        >
          Responses
        </button>
      </div>

      {activeTab === "your-list" && (
        <div className="library-content">
          {blogsLoading ? (
            <div className="page-loading">Loading your blogs...</div>
          ) : blogsError ? (
            <div className="error-state">
              <p>{blogsError}</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="library-empty-state">
              <h2>Create your own List</h2>

              <p>You haven't published any blogs yet.</p>

              <button type="button" onClick={() => navigate("/write")}>
                Write a Blog
              </button>
            </div>
          ) : (
            <div className="library-blog-list">
              {blogs.map((blog) => (
                <article key={blog._id} className="library-blog-card">
                  <div
                    className="library-blog-info"
                    onClick={() => navigate(`/blogs/${blog._id}`)}
                  >
                    <h2>{blog.title}</h2>

                    <p>
                      {new Date(blog.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="library-blog-actions">
                    <button
                      type="button"
                      onClick={() => navigate(`/blogs/${blog._id}/edit`)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteBlog(blog._id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "responses" && (
        <div className="library-content">
          {responsesLoading ? (
            <div className="page-loading">Loading responses...</div>
          ) : responsesError ? (
            <div className="error-state">
              <p>{responsesError}</p>
            </div>
          ) : responses.length === 0 ? (
            <div className="library-empty-state">
              <h2>No responses yet</h2>

              <p>Comments received on your blogs will appear here.</p>
            </div>
          ) : (
            <div className="responses-list">
              {responses.map((response) => (
                <article key={response._id} className="response-card">
                  <div className="response-author">
                    {response.author?.profileImage ? (
                      <img
                        src={response.author.profileImage}
                        alt={response.author.name}
                        className="response-author-image"
                      />
                    ) : (
                      <div className="response-author-fallback">
                        {response.author?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}

                    <div>
                      <strong>{response.author?.name || "Unknown user"}</strong>

                      <span>
                        {new Date(response.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>

                  <p className="response-content">{response.content}</p>

                  <button
                    type="button"
                    className="response-blog-link"
                    onClick={() => navigate(`/blogs/${response.blog?._id}`)}
                  >
                    On: {response.blog?.title}
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
