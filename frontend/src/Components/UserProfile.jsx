import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../Css/UserProfile.css";
import { AuthContext } from "../contexts/AuthContext";

const BASE_IMAGE_URL = "https://coffeehouse-4yii.onrender.com/";

const joinUrl = (base, path) => {
  if (!path) return "";
  // Normalize backslashes to forward slashes for URLs
  const normalizedPath = path.replace(/\\/g, "/");
  return base.replace(/\/+$/, "") + "/" + normalizedPath.replace(/^\/+/, "");
};

const UserProfile = () => {
  const { authData } = useContext(AuthContext);

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
        console.log("Using token in UserProfile:", authData?.token);
        const res = await axios.get("https://coffeehouse-4yii.onrender.com/api/user/profile", {
          headers: { Authorization: `Bearer ${authData?.token}` },
        });
        setProfile(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load profile: " + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };
    if (authData?.token) {
      fetchProfile();
    } else {
      setLoading(false);
      setError("User not authenticated");
    }
  }, [authData]);

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
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authData?.token}`,
        },
      });
      setProfile(res.data);
      setSuccessMsg("Profile updated successfully.");
    } catch (err) {
      setError("Failed to update profile: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="user-profile-loading">Loading profile...</div>;

  const backgroundImageUrl = joinUrl(BASE_IMAGE_URL, profile.profileBackgroundPicture);
  console.log("Background image URL:", backgroundImageUrl);

  return (
    <div className="user-profile-container">
      <div className="profile-header" style={{ backgroundImage: `url(${backgroundImageUrl})`, backgroundColor: '#ccc' }}>
        {console.log("Profile header style backgroundImage:", `url(${backgroundImageUrl})`)}
        <div className="profile-picture-wrapper">
          {profile.profilePicture && (
            <img
              src={joinUrl(BASE_IMAGE_URL, profile.profilePicture)}
              alt="Profile"
              className="profile-picture"
            />
          )}
        </div>
      </div>
      <h2 className="profile-name">{profile.name}</h2>
      {error && <div className="user-profile-error">{error}</div>}
      {successMsg && <div className="user-profile-success">{successMsg}</div>}
      <form className="user-profile-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={profile.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" name="address" value={profile.address} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={profile.email} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Profile Picture</label>
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setProfilePictureFile)} />
          </div>
          <div className="form-group">
            <label>Background Picture</label>
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setBackgroundPictureFile)} />
          </div>
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UserProfile;
