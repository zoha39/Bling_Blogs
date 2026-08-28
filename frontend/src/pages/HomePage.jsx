import { useEffect, useState } from "react";
import api from "../services/api";
import BlogList from "../components/BlogList";

export default function HomePage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/blogs");

      setBlogs(response.data.blogs);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load blogs. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="page-loading">Loading blogs...</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>

        <button type="button" onClick={fetchBlogs}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="home-page">
      <div className="home-header">
        <h1>Latest Blogs</h1>
      </div>

      <BlogList blogs={blogs} />
    </section>
  );
}
