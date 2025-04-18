import React from "react";
import EditBanner from "./EditBanner";
import AdminService from "./AdminService";
import AdminServiceTitleAndDescribe from "./AdminService_titleandDescribe";
import AdminBranch from "./AdminBranch";
import AdminMenu from "./AdminMenu";
import AdminReview from "./AdminReview";
import AdminContact from "./AdminContact";

const Admin = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <EditBanner />
      <AdminService/>
      <AdminServiceTitleAndDescribe/>
      <AdminBranch/>
      <AdminMenu/>
      <AdminReview/>
      <AdminContact/>
    </div>
  );
};

export default Admin;
