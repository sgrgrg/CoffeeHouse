import React, { useState, useMemo } from "react";
import { FaImage, FaServicestack, FaListAlt, FaBuilding, FaUtensils, FaStar, FaEnvelope, FaBars, FaSearch } from "react-icons/fa";
import EditBanner from "./EditBanner";
import AdminService from "./AdminService";
import AdminServiceTitleAndDescribe from "./AdminService_titleandDescribe";
import AdminBranch from "./AdminBranch";
import AdminMenu from "./AdminMenu";
import AdminReview from "./AdminReview";
import AdminContact from "./AdminContact";
import AdminOverview from "./AdminOverview";

import "../Css/AdminDashboard.css";

const menuItems = [
  { key: "AdminOverview", label: "Overview", icon: <FaBars className="icon" /> },
  { key: "EditBanner", label: "Edit Banner", icon: <FaImage className="icon" /> },
  { key: "AdminService", label: "Services", icon: <FaServicestack className="icon" /> },
  { key: "AdminServiceTitleAndDescribe", label: "Service Title & Description", icon: <FaListAlt className="icon" /> },
  { key: "AdminBranch", label: "Branches", icon: <FaBuilding className="icon" /> },
  { key: "AdminMenu", label: "Menu", icon: <FaUtensils className="icon" /> },
  { key: "AdminReview", label: "Reviews", icon: <FaStar className="icon" /> },
  { key: "AdminContact", label: "Contact", icon: <FaEnvelope className="icon" /> },
];

const Admin = () => {
  const [activeSection, setActiveSection] = useState("AdminOverview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const renderSection = () => {
    switch (activeSection) {
      case "AdminOverview":
        return <AdminOverview />;
      case "EditBanner":
        return <EditBanner />;
      case "AdminService":
        return <AdminService />;
      case "AdminServiceTitleAndDescribe":
        return <AdminServiceTitleAndDescribe />;
      case "AdminBranch":
        return <AdminBranch />;
      case "AdminMenu":
        return <AdminMenu />;
      case "AdminReview":
        return <AdminReview />;
      case "AdminContact":
        return <AdminContact />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className={`admin-dashboard ${sidebarCollapsed ? "collapsed" : ""}`}>
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Coffee House Admin</h2>
          <button className="collapse-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <FaBars />
          </button>
        </div>
        <div className="sidebar-search" title={sidebarCollapsed ? "Expand sidebar to search" : ""}>
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={false}
            style={{ cursor: "text" }}
            readOnly={false}
          />
        </div>
        <ul>
          {filteredMenuItems.map((item) => (
            <li
              key={item.key}
              className={activeSection === item.key ? "active" : ""}
              onClick={() => setActiveSection(item.key)}
              title={sidebarCollapsed ? item.label : ""}
            >
              {item.icon}
              {!sidebarCollapsed && <span className="menu-label">{item.label}</span>}
            </li>
          ))}
        </ul>
      </aside>
      <div className="admin-content">
        <header className="admin-header">
          <div className="brand">Coffee House Admin Dashboard</div>
          <div className="user-info">Admin User</div>
        </header>
        <section className="admin-section">{renderSection()}</section>
      </div>
    </div>
  );
};

export default Admin;
