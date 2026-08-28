import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");

  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const trimmedSearchTerm = searchTerm.trim();

    if (!trimmedSearchTerm) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(trimmedSearchTerm)}`);
  };

  return (
    <header className="navbar">
      <button
        type="button"
        className="menu-button"
        onClick={onMenuClick}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      <form
        ref={searchContainerRef}
        className="search-container"
        onSubmit={handleSearch}
      >
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search blogs or authors..."
          aria-label="Search blogs or authors"
        />
      </form>

      <div className="navbar-actions">
        <button
          type="button"
          onClick={() => navigate("/write")}
          className="write-button"
        >
          Write
        </button>

        <button type="button" onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </header>
  );
}
