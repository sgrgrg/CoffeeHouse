import React, { useState } from "react";
import EditBanner from "./EditBanner";
import AdminService from "./AdminService";
import AdminServiceTitleAndDescribe from "./AdminService_titleandDescribe";
import AdminBranch from "./AdminBranch";
import AdminMenu from "./AdminMenu";
import AdminReview from "./AdminReview";
import AdminContact from "./AdminContact";

import "../Css/AdminDashboard.css";

const Admin = () => {
  const [activeSection, setActiveSection] = useState("EditBanner");

  const renderSection = () => {
    switch (activeSection) {
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
        return <EditBanner />;
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h2>Coffee House Admin</h2>
        <ul>
          <li
            className={activeSection === "EditBanner" ? "active" : ""}
            onClick={() => setActiveSection("EditBanner")}
          >
            Edit Banner
          </li>
          <li
            className={activeSection === "AdminService" ? "active" : ""}
            onClick={() => setActiveSection("AdminService")}
          >
            Services
          </li>
          <li
            className={activeSection === "AdminServiceTitleAndDescribe" ? "active" : ""}
            onClick={() => setActiveSection("AdminServiceTitleAndDescribe")}
          >
            Service Title & Description
          </li>
          <li
            className={activeSection === "AdminBranch" ? "active" : ""}
            onClick={() => setActiveSection("AdminBranch")}
          >
            Branches
          </li>
          <li
            className={activeSection === "AdminMenu" ? "active" : ""}
            onClick={() => setActiveSection("AdminMenu")}
          >
            Menu
          </li>
          <li
            className={activeSection === "AdminReview" ? "active" : ""}
            onClick={() => setActiveSection("AdminReview")}
          >
            Reviews
          </li>
          <li
            className={activeSection === "AdminContact" ? "active" : ""}
            onClick={() => setActiveSection("AdminContact")}
          >
            Contact
          </li>
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
