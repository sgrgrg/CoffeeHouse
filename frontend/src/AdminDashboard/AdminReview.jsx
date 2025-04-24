import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminReview = () => {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: "", rating: "", comment: "", image: null });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get("https://coffeehouse-4yii.onrender.com//api/reviews");
      setReviews(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Enforce rating between 1 and 5
    if (name === "rating") {
      const limitedRating = Math.max(1, Math.min(5, value));
      setForm((prev) => ({ ...prev, rating: limitedRating }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    try {
      if (editId) {
        await axios.put(`https://coffeehouse-4yii.onrender.com//api/reviews/${editId}`, formData);
        alert("Review updated successfully!");
      } else {
        await axios.post("https://coffeehouse-4yii.onrender.com//api/reviews", formData);
        alert("Review added successfully!");
      }
      setForm({ name: "", rating: "", comment: "", image: null });
      setEditId(null);
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (review) => {
    setForm({
      name: review.name,
      rating: review.rating,
      comment: review.comment,
    });
    setEditId(review._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://coffeehouse-4yii.onrender.com//api/reviews/${id}`);
      alert("Review deleted successfully!");
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFeature = async (id) => {
    try {
      await axios.patch(`https://coffeehouse-4yii.onrender.com//api/reviews/${id}/toggle-feature`);
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Admin Review Management</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="rating"
          placeholder="Rating (1-5)"
          value={form.rating}
          onChange={handleChange}
          required
          min="1"
          max="5" // Enforce the range at the input level
        />
        <textarea
          name="comment"
          placeholder="Comment"
          value={form.comment}
          onChange={handleChange}
          required
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {form.image && (
          <span style={{ marginLeft: '10px', fontSize: '0.9rem', color: '#333' }}>
            {form.image.name}
          </span>
        )}
        <button type="submit">{editId ? "Update" : "Add"} Review</button>
      </form>
      <ul>
        {reviews.map((review) => (
          <li key={review._id}>
            <h4>
              {review.name} - {"⭐".repeat(Math.min(5, review.rating))}
            </h4>
            <p>{review.comment}</p>
            {review.image && (
              <img
                src={`https://coffeehouse-4yii.onrender.com//${review.image}`}
                alt="Review"
                width="100"
              />
            )}
            <button onClick={() => handleEdit(review)}>Edit</button>
            <button onClick={() => handleDelete(review._id)}>Delete</button>
            <button onClick={() => toggleFeature(review._id)}>
              {review.isFeatured ? "Unfeature" : "Feature"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminReview;
