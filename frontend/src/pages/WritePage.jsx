import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import toast from "react-hot-toast";

export default function WritePage() {
  const navigate = useNavigate();

  const insertMenuRef = useRef(null);

  const [uploadingImage, setUploadingImage] = useState(false);

  const editorRef = useRef(null);

  const fileInputRef = useRef(null);

  const [showUnsplashSearch, setShowUnsplashSearch] = useState(false);

  const [unsplashQuery, setUnsplashQuery] = useState("");

  const [unsplashImages, setUnsplashImages] = useState([]);

  const [searchingUnsplash, setSearchingUnsplash] = useState(false);

  const [unsplashError, setUnsplashError] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [showInsertMenu, setShowInsertMenu] = useState(false);

  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  const [showVideoInput, setShowVideoInput] = useState(false);

  const [youtubeUrl, setYoutubeUrl] = useState("");

  const hasWrittenContent =
    title.trim() !== "" || content.replace(/<[^>]*>/g, "").trim() !== "";

  const handleDeviceImage = () => {
    fileInputRef.current?.click();
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      toast.error("Please enter a blog title.");
      return;
    }

    if (!content.replace(/<[^>]*>/g, "").trim()) {
      toast.error("Please write some blog content.");
      return;
    }

    try {
      setCreating(true);

      const response = await api.post("/blogs", {
        title,
        content,
        youtubeUrl: youtubeUrl.trim() || null,
      });

      toast.success("Blog published successfully!");

      navigate(`/blogs/${response.data.blog._id}`);
    } catch (error) {
      console.error("Create blog error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create your blog. Please try again.",
      );
    } finally {
      setCreating(false);
    }
  };

  const handleCancel = () => {
    if (hasWrittenContent) {
      setShowExitConfirmation(true);
      return;
    }

    navigate("/");
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a JPG, PNG, WEBP, or GIF image.");

      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Image size cannot exceed 5 MB.");

      event.target.value = "";
      return;
    }

    try {
      setError("");
      setUploadingImage(true);

      const formData = new FormData();

      formData.append("image", file);

      const response = await api.post("/blogs/upload-image", formData);

      const imageUrl = response.data.image.url;

      const imageHtml = `
      <p>
        <img
          src="${imageUrl}"
          alt="Blog image"
          style="max-width: 100%; height: auto;"
        />
      </p>
    `;

      if (editorRef.current) {
        editorRef.current.insertContent(imageHtml);
      }

      setShowInsertMenu(false);

      toast.success("Image added successfully.");
    } catch (error) {
      console.error("Image upload error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to upload image. Please try again.",
      );
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleUnsplashSearch = async () => {
    const query = unsplashQuery.trim();

    if (!query) {
      setUnsplashError("Please enter something to search for.");
      return;
    }

    try {
      setSearchingUnsplash(true);
      setUnsplashError("");
      setUnsplashImages([]);

      console.log("Searching Unsplash:", query);

      const response = await api.get("/unsplash/search", {
        params: {
          query,
        },
      });

      console.log("Unsplash API response:", response.data);

      setUnsplashImages(response.data.results || []);
    } catch (error) {
      console.error("Unsplash request failed:", error);

      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);

      const message =
        error.response?.data?.message ||
        "Failed to search Unsplash. Please try again.";

      setUnsplashError(message);
      toast.error(message);
    } finally {
      setSearchingUnsplash(false);
    }
  };

  const handleUnsplashImageSelect = (image) => {
    if (!editorRef.current) {
      return;
    }

    const imageHtml = `
    <p>
      <img
        src="${image.url}"
        alt="${image.alt}"
        style="max-width: 100%; height: auto;"
      />
    </p>
  `;

    editorRef.current.insertContent(imageHtml);

    setShowUnsplashSearch(false);
    setShowInsertMenu(false);
    setUnsplashQuery("");
    setUnsplashImages([]);
    setUnsplashError("");

    toast.success("Image added successfully.");
  };

  const extractYouTubeVideoId = (url) => {
    try {
      const parsedUrl = new URL(url);

      const hostname = parsedUrl.hostname.replace(/^www\./, "");

      if (hostname === "youtube.com") {
        if (parsedUrl.pathname === "/watch") {
          const videoId = parsedUrl.searchParams.get("v");

          if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
            return videoId;
          }
        }

        if (parsedUrl.pathname.startsWith("/shorts/")) {
          const videoId = parsedUrl.pathname.split("/")[2]?.split("/")[0];

          if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
            return videoId;
          }
        }
      }

      if (hostname === "youtu.be") {
        const videoId = parsedUrl.pathname.split("/")[1]?.split("/")[0];

        if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
          return videoId;
        }
      }

      return null;
    } catch {
      return null;
    }
  };

  const handleAddYouTubeVideo = () => {
    const url = youtubeUrl.trim();

    if (!url) {
      toast.error("Please enter a YouTube URL.");
      return;
    }

    const videoId = extractYouTubeVideoId(url);

    if (!videoId) {
      toast.error("Please provide a valid YouTube URL.");
      return;
    }

    if (!editorRef.current) {
      return;
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    const iframeHtml = `
    <p>
      <iframe
        src="${embedUrl}"
        width="100%"
        height="400"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </p>
  `;

    editorRef.current.insertContent(iframeHtml);

    setError("");
    setShowVideoInput(false);
    setYoutubeUrl("");
    toast.success("Video added successfully.");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        insertMenuRef.current &&
        !insertMenuRef.current.contains(event.target)
      ) {
        setShowInsertMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const confirmExit = () => {
    setShowExitConfirmation(false);
    navigate("/");
  };

  return (
    <section className="write-page">
      <div className="write-header">
        <button
          type="button"
          className="write-brand"
          onClick={() => navigate("/")}
        >
          BLING BLOGS
        </button>
      </div>

      <form className="blog-editor-form" onSubmit={handleCreate}>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="TITLE"
          maxLength={200}
          className="blog-title-input"
        />

        <div className="editor-wrapper">
          <div ref={insertMenuRef}>
            <button
              type="button"
              className="insert-button"
              onClick={() => setShowInsertMenu((previous) => !previous)}
              aria-label="Insert content"
            >
              +
            </button>

            {showInsertMenu && (
              <div className="insert-menu">
                <button
                  type="button"
                  onClick={handleDeviceImage}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? "Uploading..." : "Add image from device"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowUnsplashSearch(true);
                    setShowInsertMenu(false);
                  }}
                >
                  Add image from Unsplash
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowVideoInput(true);
                    setShowInsertMenu(false);
                  }}
                >
                  Add video
                </button>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageUpload}
            hidden
          />

          {showUnsplashSearch && (
            <div className="unsplash-panel">
              <div className="unsplash-panel-header">
                <h2>Search Unsplash</h2>

                <button
                  type="button"
                  onClick={() => {
                    setShowUnsplashSearch(false);
                    setUnsplashImages([]);
                    setUnsplashError("");
                  }}
                  aria-label="Close Unsplash search"
                >
                  ×
                </button>
              </div>

              <div className="unsplash-search-form">
                <input
                  type="text"
                  value={unsplashQuery}
                  onChange={(event) => setUnsplashQuery(event.target.value)}
                  placeholder="Search for an image..."
                />

                <button
                  type="button"
                  onClick={handleUnsplashSearch}
                  disabled={searchingUnsplash}
                >
                  {searchingUnsplash ? "Searching..." : "Search"}
                </button>
              </div>

              {unsplashError && <p className="form-error">{unsplashError}</p>}

              {searchingUnsplash && (
                <div className="unsplash-loading">Searching Unsplash...</div>
              )}

              {!searchingUnsplash &&
                unsplashImages.length === 0 &&
                unsplashQuery.trim() !== "" &&
                !unsplashError && (
                  <div className="unsplash-empty">No images found.</div>
                )}

              {unsplashImages.length > 0 && (
                <div className="unsplash-grid">
                  {unsplashImages.map((image) => (
                    <button
                      key={image.id}
                      type="button"
                      className="unsplash-image-option"
                      onClick={() => handleUnsplashImageSelect(image)}
                    >
                      <img src={image.smallUrl} alt={image.alt} />

                      <span>{image.photographer}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {showVideoInput && (
            <div className="video-input-panel">
              <input
                type="url"
                value={youtubeUrl}
                onChange={(event) => setYoutubeUrl(event.target.value)}
                placeholder="Paste a video's URL and press 'Enter'"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleAddYouTubeVideo();
                  }
                }}
              />

              <button type="button" onClick={handleAddYouTubeVideo}>
                Add video
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowVideoInput(false);
                  setYoutubeUrl("");
                }}
              >
                Cancel
              </button>
            </div>
          )}

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
            disabled={creating}
          >
            Cancel
          </button>

          <button type="submit" className="create-button" disabled={creating}>
            {creating ? "Creating..." : "Create"}
          </button>
        </div>
      </form>

      {showExitConfirmation && (
        <div className="confirmation-backdrop">
          <div
            className="confirmation-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-dialog-title"
          >
            <h2 id="exit-dialog-title">Exit writing?</h2>

            <p>Are you sure you want to exit. Your writing will be lost</p>

            <div className="confirmation-actions">
              <button
                type="button"
                onClick={() => setShowExitConfirmation(false)}
              >
                Continue Writing
              </button>

              <button type="button" onClick={confirmExit}>
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
