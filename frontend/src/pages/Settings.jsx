import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

export default function Settings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col md:flex-row" style={{ background: "#faf8ff" }}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onAddClick={() => {}} />
      <div className="flex-1 md:ml-[232px]">
        <TopNavbar searchQuery="" onSearchChange={() => {}} onMenuClick={() => setIsSidebarOpen(true)} />
        <main style={{ paddingTop: 64 }}>
          <div style={{ padding: "32px 32px 40px" }}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="headline-xl" style={{ color: "#131b2e" }}>
                  Settings
                </h1>
                <p className="body-md mt-1" style={{ color: "#737686" }}>
                  Manage your account preferences and application settings.
                </p>
              </div>
            </div>
            <div className="card" style={{ padding: "28px 32px" }}>
              <p className="body-md" style={{ color: "#434655" }}>
                Settings are not yet implemented in this version, but the navigation is now fully functional.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
