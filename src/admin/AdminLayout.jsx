import { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import "./admin.css";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-shell">
      <div className="admin-frame">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onOpen={() => setSidebarOpen(true)} />
        <div className="admin-page">
          <Topbar />
          <motion.main
            className="admin-main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <Outlet />
          </motion.main>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
