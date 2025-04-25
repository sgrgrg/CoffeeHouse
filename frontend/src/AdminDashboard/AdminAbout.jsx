import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Css/AdminAbout.css";

const AdminAbout = () => {
  const [aboutData, setAboutData] = useState({
    whoWeAre: { title: "", content: "", image: "" },
    whatWeDo: { title: "", content: "", image: "" },
    whyChooseUs: { title: "", content: "", image: "", testimonials: [] },
    meetTheTeam: []
  });

  const [newTestimonial, setNewTestimonial] = useState({ author: "", text: "" });
  const [fileInputs, setFileInputs] = useState({});
  const [loading, setLoading] = useState({
    whoWeAre: false,
    whatWeDo: false,
    whyChooseUs: false,
    meetTheTeam: false
  });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const { data } = await axios.get("https://coffeehouse-4yii.onrender.com/api/about");
      if (data) {
        setAboutData({
          whoWeAre: data.whoWeAre || { title: "", content: "", image: "" },
          whatWeDo: data.whatWeDo || { title: "", content: "", image: "" },
          whyChooseUs: data.whyChooseUs || { title: "", content: "", image: "", testimonials: [] },
          meetTheTeam: data.meetTheTeam || []
        });
      }
    } catch (error) {
      console.error("Failed to fetch About data:", error);
    }
  };

  const handleChange = (section, field, value) => {
    setAboutData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFileChange = (e, sectionKey) => {
    const file = e.target.files[0];
    setFileInputs(prev => ({
      ...prev,
      [sectionKey]: file
    }));
  };

  const handleMeetTheTeamChange = (index, field, value) => {
    setAboutData(prev => {
      const updated = [...prev.meetTheTeam];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return { ...prev, meetTheTeam: updated };
    });
  };

  const handleMeetTheTeamFileChange = (e, index) => {
    const file = e.target.files[0];
    setFileInputs(prev => ({
      ...prev,
      [`meetTheTeamImage${index}`]: file
    }));
  };

  const addMeetTheTeamEntry = () => {
    setAboutData(prev => ({
      ...prev,
      meetTheTeam: [...prev.meetTheTeam, { title: "", content: "", image: "" }]
    }));
  };

  const removeMeetTheTeamEntry = (index) => {
    setAboutData(prev => ({
      ...prev,
      meetTheTeam: prev.meetTheTeam.filter((_, i) => i !== index)
    }));
    setFileInputs(prev => {
      const copy = { ...prev };
      delete copy[`meetTheTeamImage${index}`];
      return copy;
    });
  };

  const handleTestimonialChange = (field, value) => {
    setNewTestimonial(prev => ({ ...prev, [field]: value }));
  };

  const addTestimonial = () => {
    if (newTestimonial.author.trim() && newTestimonial.text.trim()) {
      setAboutData(prev => ({
        ...prev,
        whyChooseUs: {
          ...prev.whyChooseUs,
          testimonials: [...(prev.whyChooseUs.testimonials || []), newTestimonial]
        }
      }));
      setNewTestimonial({ author: "", text: "" });
    }
  };

  const removeTestimonial = (index) => {
    if (window.confirm("Are you sure you want to remove this testimonial?")) {
      setAboutData(prev => ({
        ...prev,
        whyChooseUs: {
          ...prev.whyChooseUs,
          testimonials: prev.whyChooseUs.testimonials.filter((_, i) => i !== index)
        }
      }));
    }
  };

  const submitSection = async (sectionKey) => {
    setLoading(prev => ({ ...prev, [sectionKey]: true }));

    if (sectionKey !== "meetTheTeam") {
      const content = aboutData[sectionKey]?.content;
      if (!content || content.trim() === "") {
        alert(`Content for ${sectionKey} is required.`);
        setLoading(prev => ({ ...prev, [sectionKey]: false }));
        return;
      }
    } else {
      for (let i = 0; i < aboutData.meetTheTeam.length; i++) {
        if (!aboutData.meetTheTeam[i].content || aboutData.meetTheTeam[i].content.trim() === "") {
          alert(`Content for Meet The Team entry #${i + 1} is required.`);
          setLoading(prev => ({ ...prev, [sectionKey]: false }));
          return;
        }
      }
    }

    try {
      const formData = new FormData();

      if (sectionKey === "meetTheTeam") {
        aboutData.meetTheTeam.forEach((entry, idx) => {
          formData.append("meetTheTeamTitle[]", entry.title);
          formData.append("meetTheTeamContent[]", entry.content);
          if (fileInputs[`meetTheTeamImage${idx}`]) {
            formData.append(`meetTheTeamImage${idx}`, fileInputs[`meetTheTeamImage${idx}`]);
          }
        });
      } else if (sectionKey === "whyChooseUs") {
        formData.append("whyChooseUsTitle", aboutData.whyChooseUs.title);
        formData.append("whyChooseUsContent", aboutData.whyChooseUs.content);
        formData.append("testimonials", JSON.stringify(aboutData.whyChooseUs.testimonials));
        if (fileInputs.whyChooseUsImage) {
          formData.append("whyChooseUsImage", fileInputs.whyChooseUsImage);
        }
      } else {
        formData.append(`${sectionKey}Title`, aboutData[sectionKey].title);
        formData.append(`${sectionKey}Content`, aboutData[sectionKey].content);
        if (fileInputs[`${sectionKey}Image`]) {
          formData.append(`${sectionKey}Image`, fileInputs[`${sectionKey}Image`]);
        }
      }

      const authData = localStorage.getItem("authData");
      const token = authData ? JSON.parse(authData).token : null;
      if (!token) {
        alert("You must be logged in as admin to perform this action.");
        setLoading(prev => ({ ...prev, [sectionKey]: false }));
        return;
      }

      await axios.put("https://coffeehouse-4yii.onrender.com/api/about", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });

      alert(`${sectionKey} updated successfully.`);
      fetchAboutData();
    } catch (error) {
      console.error(`Error updating ${sectionKey}:`, error);
      alert(`Failed to update ${sectionKey}.`);
    } finally {
      setLoading(prev => ({ ...prev, [sectionKey]: false }));
    }
  };

  return (
    <div className="admin-about-container">
      <h2 className="admin-about-title">Admin About Us Management</h2>

      {/* Who We Are Section */}
      <section className="about-section">
        <h3>Who We Are</h3>
        <input
          type="text"
          placeholder="Title"
          value={aboutData.whoWeAre.title}
          onChange={(e) => handleChange("whoWeAre", "title", e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={aboutData.whoWeAre.content}
          onChange={(e) => handleChange("whoWeAre", "content", e.target.value)}
        />
        <div>
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "whoWeAreImage")}
          />
          {aboutData.whoWeAre.image && (
            <img
              src={`https://coffeehouse-4yii.onrender.com${aboutData.whoWeAre.image.startsWith('/') ? '' : '/'}${aboutData.whoWeAre.image}`}
              alt="Who We Are"
              style={{ width: "150px", marginTop: "10px" }}
            />
          )}
        </div>
        <button
          onClick={() => submitSection("whoWeAre")}
          disabled={loading.whoWeAre}
        >
          {loading.whoWeAre ? "Saving..." : "Save Who We Are"}
        </button>
      </section>

      {/* What We Do Section */}
      <section className="about-section">
        <h3>What We Do</h3>
        <input
          type="text"
          placeholder="Title"
          value={aboutData.whatWeDo.title}
          onChange={(e) => handleChange("whatWeDo", "title", e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={aboutData.whatWeDo.content}
          onChange={(e) => handleChange("whatWeDo", "content", e.target.value)}
        />
        <div>
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "whatWeDoImage")}
          />
          {aboutData.whatWeDo.image && (
            <img
              src={`https://coffeehouse-4yii.onrender.com${aboutData.whatWeDo.image.startsWith('/') ? '' : '/'}${aboutData.whatWeDo.image}`}
              alt="What We Do"
              style={{ width: "150px", marginTop: "10px" }}
            />
          )}
        </div>
        <button
          onClick={() => submitSection("whatWeDo")}
          disabled={loading.whatWeDo}
        >
          {loading.whatWeDo ? "Saving..." : "Save What We Do"}
        </button>
      </section>

      {/* Why Choose Us Section */}
      <section className="about-section">
        <h3>Why Choose Us</h3>
        <input
          type="text"
          placeholder="Title"
          value={aboutData.whyChooseUs.title}
          onChange={(e) => handleChange("whyChooseUs", "title", e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={aboutData.whyChooseUs.content}
          onChange={(e) => handleChange("whyChooseUs", "content", e.target.value)}
        />
        <div>
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "whyChooseUsImage")}
          />
          {aboutData.whyChooseUs.image && (
            <img
              src={`https://coffeehouse-4yii.onrender.com${aboutData.whyChooseUs.image.startsWith('/') ? '' : '/'}${aboutData.whyChooseUs.image}`}
              alt="Why Choose Us"
              style={{ width: "150px", marginTop: "10px" }}
            />
          )}
        </div>

        {/* Testimonials */}
        <div className="testimonials-section">
          <h4>Testimonials</h4>
          {aboutData.whyChooseUs.testimonials && aboutData.whyChooseUs.testimonials.length > 0 ? (
            aboutData.whyChooseUs.testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-item">
                <input
                  type="text"
                  placeholder="Author"
                  value={testimonial.author}
                  onChange={(e) => {
                    const updatedTestimonials = [...aboutData.whyChooseUs.testimonials];
                    updatedTestimonials[index].author = e.target.value;
                    handleChange("whyChooseUs", "testimonials", updatedTestimonials);
                  }}
                />
                <textarea
                  placeholder="Text"
                  value={testimonial.text}
                  onChange={(e) => {
                    const updatedTestimonials = [...aboutData.whyChooseUs.testimonials];
                    updatedTestimonials[index].text = e.target.value;
                    handleChange("whyChooseUs", "testimonials", updatedTestimonials);
                  }}
                />
                <button onClick={() => removeTestimonial(index)}>Remove</button>
              </div>
            ))
          ) : (
            <p>No testimonials added yet.</p>
          )}

          <div className="add-testimonial">
            <input
              type="text"
              placeholder="Author"
              value={newTestimonial.author}
              onChange={(e) => handleTestimonialChange("author", e.target.value)}
            />
            <textarea
              placeholder="Text"
              value={newTestimonial.text}
              onChange={(e) => handleTestimonialChange("text", e.target.value)}
            />
            <button onClick={addTestimonial}>Add Testimonial</button>
          </div>
        </div>

        <button
          onClick={() => submitSection("whyChooseUs")}
          disabled={loading.whyChooseUs}
        >
          {loading.whyChooseUs ? "Saving..." : "Save Why Choose Us"}
        </button>
      </section>

      {/* Meet The Team Section */}
      <section className="about-section">
        <h3>Meet The Team</h3>
        {aboutData.meetTheTeam && aboutData.meetTheTeam.length > 0 ? (
          aboutData.meetTheTeam.map((member, index) => (
            <div key={index} className="meet-the-team-item">
              <input
                type="text"
                placeholder="Title"
                value={member.title}
                onChange={(e) => handleMeetTheTeamChange(index, "title", e.target.value)}
              />
              <textarea
                placeholder="Content"
                value={member.content}
                onChange={(e) => handleMeetTheTeamChange(index, "content", e.target.value)}
              />
              <div>
                <label>Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleMeetTheTeamFileChange(e, index)}
                />
                {member.image && (
                  <img
                    src={`https://coffeehouse-4yii.onrender.com${member.image.startsWith('/') ? '' : '/'}${member.image}`}
                    alt={`Meet The Team ${index + 1}`}
                    style={{ width: "150px", marginTop: "10px" }}
                  />
                )}
              </div>
              <button onClick={() => removeMeetTheTeamEntry(index)}>Remove</button>
            </div>
          ))
        ) : (
          <p>No team members added yet.</p>
        )}
        <button onClick={addMeetTheTeamEntry}>Add Team Member</button>
        <button
          onClick={() => submitSection("meetTheTeam")}
          disabled={loading.meetTheTeam}
        >
          {loading.meetTheTeam ? "Saving..." : "Save Meet The Team"}
        </button>
      </section>
    </div>
  );
};

export default AdminAbout;
