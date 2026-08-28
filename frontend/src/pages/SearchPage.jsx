import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import BlogList from "../components/BlogList";

export default function SearchPage() {
  const [searchParams] = useSearchParams();

  const searchTerm = searchParams.get("q")?.trim() || "";

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const searchBlogs = async () => {
      if (!searchTerm) {
        setBlogs([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/blogs/search?q=${encodeURIComponent(searchTerm)}`,
        );

        setBlogs(response.data.blogs || []);
      } catch (error) {
        console.error("Failed to search blogs:", error);

        setError(
          error.response?.data?.message ||
            "Failed to search blogs. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    searchBlogs();
  }, [searchTerm]);

  if (loading) {
    return <div className="page-loading">Searching blogs...</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <section className="search-page">
      <div className="search-page-header">
        <h1>Search Results</h1>

        <p>
          Results for <strong>"{searchTerm}"</strong>
        </p>
      </div>

      {blogs.length === 0 ? (
        <div className="search-empty-state">
          <h2>No blogs found</h2>

          <p>We couldn't find any blogs matching "{searchTerm}".</p>
        </div>
      ) : (
        <BlogList blogs={blogs} />
      )}
    </section>
  );
}
