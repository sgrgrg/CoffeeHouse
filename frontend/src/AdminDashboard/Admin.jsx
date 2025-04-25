import React, { useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaImage, FaServicestack, FaListAlt, FaBuilding, FaUtensils, FaStar, FaEnvelope, FaBars, FaSearch } from "react-icons/fa";
import EditBanner from "./EditBanner";
import AdminService from "./AdminService";
import AdminServiceTitleAndDescribe from "./AdminService_titleandDescribe";
import AdminBranch from "./AdminBranch";
import AdminMenu from "./AdminMenu";
import AdminReview from "./AdminReview";
import AdminContact from "./AdminContact";
import AdminOverview from "./AdminOverview";

import "../Css/AdminDashboardLayout.css";

import AdminUserManagement from "./AdminUserManagement";
import AdminAbout from "./AdminAbout";
import AdminTrainings from "./AdminTrainings";
import AdminStudentSuccessStories from "./AdminStudentSuccessStories";
import AdminEvents from "./AdminEvents";
import AdminTeam from "./AdminTeam";
import AdminFAQs from "./AdminFAQs";
import AdminCareers from "./AdminCareers";
import { AuthContext } from "../contexts/AuthContext";

const menuItems = [
  { key: "AdminOverview", label: "Overview", icon: <FaBars className="admin-icon" /> },
  { key: "EditBanner", label: "Edit Banner", icon: <FaImage className="admin-icon" /> },
  { key: "AdminService", label: "Services", icon: <FaServicestack className="admin-icon" /> },
  { key: "AdminServiceTitleAndDescribe", label: "Service Title & Description", icon: <FaListAlt className="admin-icon" /> },
  { key: "AdminBranch", label: "Branches", icon: <FaBuilding className="admin-icon" /> },
  { key: "AdminMenu", label: "Menu", icon: <FaUtensils className="admin-icon" /> },
  { key: "AdminReview", label: "Reviews", icon: <FaStar className="admin-icon" /> },
  { key: "AdminContact", label: "Contact", icon: <FaEnvelope className="admin-icon" /> },
  { key: "AdminAbout", label: "About Us", icon: <FaBars className="admin-icon" /> },
  { key: "AdminUserManagement", label: "User Management", icon: <FaBars className="admin-icon" /> },
  { key: "AdminTrainings", label: "Trainings", icon: <FaBars className="admin-icon" /> },
  { key: "AdminStudentSuccessStories", label: "Student Success Stories", icon: <FaBars className="admin-icon" /> },
  { key: "AdminEvents", label: "Upcoming Events & Workshops", icon: <FaBars className="admin-icon" /> },
  { key: "AdminTeam", label: "Team", icon: <FaBars className="admin-icon" /> },
  { key: "AdminFAQs", label: "FAQs", icon: <FaBars className="admin-icon" /> },
  { key: "AdminCareers", label: "Careers", icon: <FaBars className="admin-icon" /> },
];

const Admin = () => {
  const [activeSection, setActiveSection] = useState("AdminOverview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { authData, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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
      case "AdminAbout":
        return <AdminAbout />;
      case "AdminUserManagement":
        return <AdminUserManagement />;
      case "AdminTrainings":
        return <AdminTrainings />;
      case "AdminStudentSuccessStories":
        return <AdminStudentSuccessStories />;
      case "AdminEvents":
        return <AdminEvents />;
      case "AdminTeam":
        return <AdminTeam />;
      case "AdminFAQs":
        return <AdminFAQs />;
      case "AdminCareers":
        return <AdminCareers />;
      default:
        return <AdminOverview />;
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={`admin-admin-dashboard ${sidebarCollapsed ? "admin-collapsed" : ""}`}>
      <aside className="admin-admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Coffee House Admin</h2>
          <button className="admin-collapse-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <FaBars />
          </button>
        </div>
        <div className="admin-sidebar-search" title={sidebarCollapsed ? "Expand sidebar to search" : ""}>
          <FaSearch className="admin-search-icon" />
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
              className={activeSection === item.key ? "admin-active" : ""}
              onClick={() => setActiveSection(item.key)}
              title={sidebarCollapsed ? item.label : ""}
            >
              {item.icon}
              {!sidebarCollapsed && <span className="admin-menu-label">{item.label}</span>}
            </li>
          ))}
        </ul>
      </aside>
      <div className="admin-admin-content">
        <header className="admin-admin-header">
          <div className="admin-brand">Coffee House Admin Dashboard</div>
          <div className="admin-user-info">
            {authData && authData.username ? authData.username : "Admin User"}
            <button onClick={handleLogout} style={{ marginLeft: "10px", cursor: "pointer" }}>
              Logout
            </button>
          </div>
        </header>
        <section className="admin-admin-section">{renderSection()}</section>
      </div>
    </div>
  );
};

export default Admin;
