import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    about: "",
  });

  const [profileImage, setProfileImage] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setProfileImage(null);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, WEBP, or GIF image.");
      event.target.value = "";
      setProfileImage(null);
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Profile image cannot exceed 5 MB.");
      event.target.value = "";
      setProfileImage(null);
      return;
    }

    setError("");
    setProfileImage(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login({
          email: form.email,
          password: form.password,
        });
      } else {
        if (!profileImage) {
          setError("Please select a profile image.");
          setLoading(false);
          return;
        }

        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("password", form.password);
        formData.append("about", form.about);
        formData.append("profileImage", profileImage);

        await register(formData);
      }

      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>BLING BLOGS</h1>

        <h2>{mode === "login" ? "Sign In" : "Create Account"}</h2>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <div className="profile-image-input">
                <label htmlFor="profileImage">Profile Image</label>

                <input
                  id="profileImage"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleProfileImageChange}
                  required
                />

                {profileImage && <p>{profileImage.name}</p>}
              </div>

              <textarea
                name="about"
                placeholder="About yourself"
                value={form.about}
                onChange={handleChange}
                maxLength={500}
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
          />

          <button type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Sign In"
                : "Sign Up"}
          </button>
        </form>

        <button type="button" className="auth-switch" onClick={switchMode}>
          {mode === "login"
            ? "Don't have an account? Sign Up"
            : "Already have an account? Sign In"}
        </button>
      </div>
    </main>
  );
}
