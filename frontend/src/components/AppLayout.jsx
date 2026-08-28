import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((previous) => !previous);
  };

  return (
    <div className="app-layout">
      <Navbar onMenuClick={toggleSidebar} />

      <div className="app-body">
        <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
