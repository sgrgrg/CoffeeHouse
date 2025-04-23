import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Css/UserProfile.css";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    email: "",
    profilePicture: "",
    profileBackgroundPicture: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [backgroundPictureFile, setBackgroundPictureFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://coffeehouse-4yii.onrender.com/api/user/profile", { withCredentials: true });
        setProfile(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load profile: " + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, setFile) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg("");
    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("address", profile.address);
      formData.append("phoneNumber", profile.phoneNumber);
      formData.append("email", profile.email);
      if (profilePictureFile) formData.append("profilePicture", profilePictureFile);
      if (backgroundPictureFile) formData.append("profileBackgroundPicture", backgroundPictureFile);

      const res = await axios.put("https://coffeehouse-4yii.onrender.com/api/user/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setProfile(res.data);
      setSuccessMsg("Profile updated successfully.");
    } catch (err) {
      setError("Failed to update profile: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="user-profile-loading">Loading profile...</div>;

  return (
    <div className="user-profile-container">
      <h2>User Profile</h2>
      {error && <div className="user-profile-error">{error}</div>}
      {successMsg && <div className="user-profile-success">{successMsg}</div>}
      <form className="user-profile-form" onSubmit={handleSubmit}>
        <div className="profile-picture-section">
          <label>Profile Picture</label>
          {profile.profilePicture && <img src={`/${profile.profilePicture}`} alt="Profile" className="profile-picture-preview" />}
          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setProfilePictureFile)} />
        </div>
        <div className="profile-background-section">
          <label>Profile Background Picture</label>
          {profile.profileBackgroundPicture && <img src={`/${profile.profileBackgroundPicture}`} alt="Background" className="profile-background-preview" />}
          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setBackgroundPictureFile)} />
        </div>
        <label>Name</label>
        <input type="text" name="name" value={profile.name} onChange={handleChange} />
        <label>Address</label>
        <input type="text" name="address" value={profile.address} onChange={handleChange} />
        <label>Phone Number</label>
        <input type="text" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} />
        <label>Email</label>
        <input type="email" name="email" value={profile.email} onChange={handleChange} />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UserProfile;
