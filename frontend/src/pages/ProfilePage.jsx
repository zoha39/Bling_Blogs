import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, fetchCurrentUser } = useAuth();

  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || "");
  const [about, setAbout] = useState(user?.about || "");

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      setSaving(true);

      await api.put("/users/profile", {
        name,
        about,
      });

      await fetchCurrentUser();

      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Update profile error:", error);

      const message =
        error.response?.data?.message ||
        "Failed to update your profile. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, WEBP, or GIF image.");
      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Image size cannot exceed 5 MB.");
      event.target.value = "";
      return;
    }

    try {
      setError("");
      setUploadingImage(true);

      const formData = new FormData();

      formData.append("image", file);

      await api.post("/users/profile/image", formData);

      await fetchCurrentUser();

      toast.success("Profile image updated successfully.");
    } catch (error) {
      console.error("Profile image upload error:", error);

      const message =
        error.response?.data?.message ||
        "Failed to upload profile image. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  if (!user) {
    return null;
  }

  return (
    <section className="profile-page">
      <div className="profile-header">
        <h1>Profile</h1>
        <p>Manage your profile information.</p>
      </div>

      <div className="profile-card">
        <div className="profile-image-section">
          <button
            type="button"
            className="profile-image-button"
            onClick={handleProfileImageClick}
            disabled={uploadingImage}
          >
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="profile-image"
              />
            ) : (
              <div className="profile-image-fallback">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
            )}

            <span className="profile-image-overlay">
              {uploadingImage ? "Uploading..." : "Change photo"}
            </span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleProfileImageUpload}
            hidden
          />
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input id="email" type="email" value={user.email} disabled />
          </div>

          <div className="form-group">
            <label htmlFor="about">About</label>

            <textarea
              id="about"
              value={about}
              onChange={(event) => setAbout(event.target.value)}
              maxLength={500}
              rows={5}
              placeholder="Tell readers something about yourself..."
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </section>
  );
}
