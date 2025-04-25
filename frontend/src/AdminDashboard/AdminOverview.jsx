import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaServicestack, FaBuilding, FaUtensils, FaStar, FaEnvelope, FaUserShield } from "react-icons/fa";

const AdminOverview = () => {
  const [stats, setStats] = useState({
    servicesCount: 0,
    branchesCount: 0,
    menuItemsCount: 0,
    reviewsCount: 0,
    contactsCount: 0,
    adminsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [servicesRes, branchesRes, menuRes, reviewsRes, contactsRes, adminsRes] = await Promise.all([
        axios.get("https://coffeehouse-4yii.onrender.com/api/service"),
        axios.get("https://coffeehouse-4yii.onrender.com/api/admin/branches"),
        axios.get("https://coffeehouse-4yii.onrender.com/api/menu"),
        axios.get("https://coffeehouse-4yii.onrender.com/api/reviews"),
        axios.get("https://coffeehouse-4yii.onrender.com/api/admin/messages"),
        axios.get("https://coffeehouse-4yii.onrender.com/api/admins"),
      ]);
      setStats({
        servicesCount: Array.isArray(servicesRes.data) ? servicesRes.data.length : 0,
        branchesCount: branchesRes.data.branch && Array.isArray(branchesRes.data.branch.branches) ? branchesRes.data.branch.branches.length : 0,
        menuItemsCount: Array.isArray(menuRes.data) ? menuRes.data.length : 0,
        reviewsCount: Array.isArray(reviewsRes.data) ? reviewsRes.data.length : 0,
        contactsCount: Array.isArray(contactsRes.data) ? contactsRes.data.length : 0,
        adminsCount: Array.isArray(adminsRes.data) ? adminsRes.data.length : 0,
      });
      setLoading(false);
    } catch (err) {
      setError("Failed to load stats: " + (err.message || ""));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <div className="loading-message">Loading overview...</div>;
  if (error) return (
    <div className="error-message">
      <p>{error}</p>
      <button onClick={() => {
        setError(null);
        fetchStats();
      }}>Retry</button>
    </div>
  );

  return (
    <div className="admin-overview">
      <h2>Dashboard Overview</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <FaServicestack className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.servicesCount}</h3>
            <p>Services</p>
          </div>
        </div>
        <div className="stat-card">
          <FaBuilding className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.branchesCount}</h3>
            <p>Branches</p>
          </div>
        </div>
        <div className="stat-card">
          <FaUtensils className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.menuItemsCount}</h3>
            <p>Menu Items</p>
          </div>
        </div>
        <div className="stat-card">
          <FaStar className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.reviewsCount}</h3>
            <p>Reviews</p>
          </div>
        </div>
        <div className="stat-card">
          <FaEnvelope className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.contactsCount}</h3>
            <p>Contacts</p>
          </div>
        </div>
        <div className="stat-card">
          <FaUserShield className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.adminsCount}</h3>
            <p>Admins</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
