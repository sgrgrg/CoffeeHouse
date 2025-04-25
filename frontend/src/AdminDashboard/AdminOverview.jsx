import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { 
  FaServicestack, 
  FaBuilding, 
  FaUtensils, 
  FaStar, 
  FaEnvelope, 
  FaUserShield,
  FaChalkboardTeacher,
  FaUsers,
  FaGraduationCap,
  FaCalendarAlt
} from "react-icons/fa";
import { AuthContext } from "../contexts/AuthContext";
import "../Css/AdminOverview.css";

const AdminOverview = () => {
  const { authData } = useContext(AuthContext);
  const token = authData?.token || "";

  const [stats, setStats] = useState({
    servicesCount: 0,
    branchesCount: 0,
    menuItemsCount: 0,
    reviewsCount: 0,
    contactsCount: 0,
    adminsCount: 0,
    trainingsCount: 0,
    teamCount: 0,
    successStoriesCount: 0,
    eventsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const [
        servicesRes, 
        branchesRes, 
        menuRes, 
        reviewsRes, 
        contactsRes, 
        adminsRes,
        trainingsRes,
        teamRes,
        successStoriesRes,
        eventsRes
      ] = await Promise.all([
        axios.get("https://coffeehouse-4yii.onrender.com/api/service", config),
        axios.get("https://coffeehouse-4yii.onrender.com/api/admin/branches", config),
        axios.get("https://coffeehouse-4yii.onrender.com/api/menu", config),
        axios.get("https://coffeehouse-4yii.onrender.com/api/reviews", config),
        axios.get("https://coffeehouse-4yii.onrender.com/api/admin/messages", config),
        axios.get("https://coffeehouse-4yii.onrender.com/api/user/admin/users", config),
        axios.get("https://coffeehouse-4yii.onrender.com/api/trainings", config),
        axios.get("https://coffeehouse-4yii.onrender.com/api/team", config),
        axios.get("https://coffeehouse-4yii.onrender.com/api/student-success-stories", config),
        axios.get("https://coffeehouse-4yii.onrender.com/api/events", config),
      ]);
      setStats({
        servicesCount: Array.isArray(servicesRes.data) ? servicesRes.data.length : 0,
        branchesCount: branchesRes.data.branch && Array.isArray(branchesRes.data.branch.branches) ? branchesRes.data.branch.branches.length : 0,
        menuItemsCount: Array.isArray(menuRes.data) ? menuRes.data.length : 0,
        reviewsCount: Array.isArray(reviewsRes.data) ? reviewsRes.data.length : 0,
        contactsCount: Array.isArray(contactsRes.data) ? contactsRes.data.length : 0,
        adminsCount: Array.isArray(adminsRes.data) ? adminsRes.data.filter(admin => admin.isAdmin).length : 0,
        trainingsCount: Array.isArray(trainingsRes.data) ? trainingsRes.data.length : 0,
        teamCount: Array.isArray(teamRes.data) ? teamRes.data.length : 0,
        successStoriesCount: Array.isArray(successStoriesRes.data) ? successStoriesRes.data.length : 0,
        eventsCount: Array.isArray(eventsRes.data) ? eventsRes.data.length : 0,
      });
      setLoading(false);
    } catch (err) {
      setError("Failed to load stats: " + (err.message || ""));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

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
        <div className="stat-card">
          <FaChalkboardTeacher className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.trainingsCount}</h3>
            <p>Trainings</p>
          </div>
        </div>
        <div className="stat-card">
          <FaUsers className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.teamCount}</h3>
            <p>Team Members</p>
          </div>
        </div>
        <div className="stat-card">
          <FaGraduationCap className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.successStoriesCount}</h3>
            <p>Success Stories</p>
          </div>
        </div>
        <div className="stat-card">
          <FaCalendarAlt className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.eventsCount}</h3>
            <p>Events</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
