import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

export default function EditBlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const editorRef = useRef(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/blogs/${id}`);

        const blog = response.data.blog;

        setTitle(blog.title || "");
        setContent(blog.content || "");
      } catch (error) {
        console.error("Failed to load blog for editing:", error);

        const message =
          error.response?.data?.message ||
          "Failed to load this blog for editing.";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleUpdate = async (event) => {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Please enter a blog title.");
      return;
    }

    if (!content.replace(/<[^>]*>/g, "").trim()) {
      setError("Please write some blog content.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.put(`/blogs/${id}`, {
        title,
        content,
      });

      toast.success("Blog updated successfully.");

      navigate(`/blogs/${response.data.blog._id}`);
    } catch (error) {
      console.error("Update blog error:", error);

      const message =
        error.response?.data?.message ||
        "Failed to update your blog. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/blogs/${id}`);
  };

  if (loading) {
    return <div className="page-loading">Loading editor...</div>;
  }

  if (error && !title && !content) {
    return (
      <div className="error-state">
        <p>{error}</p>

        <button type="button" onClick={() => navigate(`/blogs/${id}`)}>
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <section className="write-page">
      <div className="write-header">
        <button
          type="button"
          className="write-brand"
          onClick={() => navigate(`/blogs/${id}`)}
        >
          BLING BLOGS
        </button>
      </div>

      <form className="blog-editor-form" onSubmit={handleUpdate}>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="TITLE"
          maxLength={200}
          className="blog-title-input"
          disabled={saving}
        />

        <div className="editor-wrapper">
          <Editor
            onInit={(event, editor) => {
              editorRef.current = editor;
            }}
            apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
            value={content}
            onEditorChange={(newContent) => {
              setContent(newContent);
            }}
            init={{
              height: 500,
              menubar: false,
              plugins: ["lists", "link", "image", "code", "table"],
              toolbar:
                "undo redo | blocks | bold italic underline | " +
                "bullist numlist | blockquote | link | image | " +
                "table | removeformat",
              placeholder: "Tell your story......",
              content_style: `
                body {
                  font-family: Arial, sans-serif;
                  font-size: 18px;
                  line-height: 1.7;
                  color: #333;
                  padding: 10px;
                }
              `,
            }}
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="write-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </button>

          <button type="submit" className="create-button" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
}
