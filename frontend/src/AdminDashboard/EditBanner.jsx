import React, { useState, useEffect } from "react";
import axios from "axios";

const MAX_TITLE_LENGTH = 50; // Maximum characters for the title
const MAX_DESCRIPTION_LENGTH = 300; // Maximum characters for the description

const EditBanner = () => {
  const [banner, setBanner] = useState({
    title: "",
    description: "",
    facebook: "",
    instagram: "",
    youtube: "",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/banner")
      .then((res) => {
        const data = res.data;
        if (!data) {
          // No banner found, clear banner state and preview image
          setBanner({
            title: "",
            description: "",
            facebook: "",
            instagram: "",
            youtube: "",
            image: null,
            _id: null,
          });
          setPreviewImage("");
          return;
        }
        setBanner({
          title: data.title || "",
          description: data.description || "",
          facebook: data.facebook || "",
          instagram: data.instagram || "",
          youtube: data.youtube || "",
          image: data.image || null,
          _id: data._id || null,
        });
        setPreviewImage(data.image ? `http://localhost:5000/${data.image}` : "");
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Limit character count for title and description
    if (name === "title" && value.length > MAX_TITLE_LENGTH) return;
    if (name === "description" && value.length > MAX_DESCRIPTION_LENGTH) return;

    setBanner((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setBanner((prev) => ({ ...prev, image: file }));
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!banner._id) {
      alert("No banner exists to update.");
      return;
    }

    const formData = new FormData();
    formData.append("title", banner.title);
    formData.append("description", banner.description);
    formData.append("facebook", banner.facebook);
    formData.append("instagram", banner.instagram);
    formData.append("youtube", banner.youtube);
    if (banner.image) formData.append("image", banner.image);

    axios.put(`http://localhost:5000/api/banner/${banner._id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(() => alert("Banner updated successfully!"))
      .catch((err) => console.error(err));
  };

  return (
    <div className="edit-banner">
      <h2>Edit Banner</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={banner.title}
            onChange={handleChange}
          />
          <small>{banner.title.length}/{MAX_TITLE_LENGTH} characters</small>
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={banner.description}
            onChange={handleChange}
          />
          <small>{banner.description.length}/{MAX_DESCRIPTION_LENGTH} characters</small>
        </label>
        <label>
          Image:
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {previewImage && <img src={previewImage} alt="Preview" width="100" />}
        </label>
        <label>
          Facebook Link:
          <input
            type="text"
            name="facebook"
            value={banner.facebook}
            onChange={handleChange}
          />
        </label>
        <label>
          Instagram Link:
          <input
            type="text"
            name="instagram"
            value={banner.instagram}
            onChange={handleChange}
          />
        </label>
        <label>
          YouTube Link:
          <input
            type="text"
            name="youtube"
            value={banner.youtube}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditBanner;
