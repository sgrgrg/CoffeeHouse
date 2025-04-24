import React, { useEffect, useState } from 'react';
import axios from 'axios';


const AdminFAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [formData, setFormData] = useState({ question: '', answer: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await axios.get('https://coffeehouse-4yii.onrender.com/api/faqs');
      setFaqs(response.data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`https://coffeehouse-4yii.onrender.com/api/faqs/${editingId}`, formData);
      } else {
        await axios.post('https://coffeehouse-4yii.onrender.com/api/faqs', formData);
      }
      setFormData({ question: '', answer: '' });
      setEditingId(null);
      fetchFAQs();
    } catch (error) {
      console.error('Error saving FAQ:', error);
    }
  };

  const handleEdit = faq => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
    });
    setEditingId(faq._id);
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`https://coffeehouse-4yii.onrender.com/api/faqs/${id}`);
      fetchFAQs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    }
  };

  return (
    <div className="admin-faqs-container">
      <h1>Manage FAQs</h1>
      <form onSubmit={handleSubmit} className="admin-faqs-form">
        <input
          type="text"
          name="question"
          placeholder="Question"
          value={formData.question}
          onChange={handleChange}
          required
        />
        <textarea
          name="answer"
          placeholder="Answer"
          value={formData.answer}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingId ? 'Update' : 'Add'} FAQ</button>
      </form>
      <div className="admin-faqs-list">
        {faqs.map(faq => (
          <div key={faq._id} className="admin-faq-item">
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
            <button onClick={() => handleEdit(faq)}>Edit</button>
            <button onClick={() => handleDelete(faq._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFAQs;
