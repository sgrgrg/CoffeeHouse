import React from "react";
import "../Css/Contact.css";

const Contact = () => {
  return (
    <div className="container my-5">
      <div className="row">
        {/* Contact Form Section */}
        <div className="col-md-6">
          <h2 className="mb-4 text-primary">Contact Us</h2>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input type="text" className="form-control" id="name" placeholder="Your Name" required />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input type="email" className="form-control" id="email" placeholder="Your Email" required />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                Message
              </label>
              <textarea className="form-control" id="message" rows="4" placeholder="Your Message" required></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Send Message
            </button>
          </form>
        </div>

        {/* Main Location Section */}
        <div className="col-md-6">
          <h2 className="mb-4 text-primary">Our Location</h2>
          <div className="map-container mb-4">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113032.65322787261!2d85.24373135767756!3d27.708935957714655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a307baabf%3A0xb5137c1bf18db1ea!2sKathmandu%2044600!5e0!3m2!1sen!2snp!4v1738050874736!5m2!1sen!2snp"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Main Location"
            ></iframe>
          </div>
          <p>
            <strong>Tridevi Marg, Thamel</strong>
            <br />
            Kathmandu, Nepal
          </p>
          <p>
            <strong>Email:</strong> info@himalayanjava.com
            <br />
            <strong>Phone:</strong> +977-(01)-4435171
          </p>
        </div>
      </div>

      {/* Branches Section */}
      <div className="mt-5">
        <h2 className="mb-4 text-primary">Our Branches</h2>
        <div className="row">
          {/* Main Branch */}
          <div className="col-md-6 mb-4">
            <h4 className="text-secondary">Main Branch</h4>
            <div className="map-container mb-3">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113032.65322787261!2d85.24373135767756!3d27.708935957714655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a307baabf%3A0xb5137c1bf18db1ea!2sTridevi%20Marg%2C%20Thamel!5e0!3m2!1sen!2snp!4v1738050874736!5m2!1sen!2snp"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Main Branch Location"
              ></iframe>
            </div>
            <p>
              <strong>Email:</strong> info@mainbranch.com
              <br />
              <strong>Phone:</strong> +977-(01)-4435171
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-youtube"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="mailto:info@mainbranch.com" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-envelope-fill"></i>
              </a>
            </div>
          </div>

          {/* Durbar Marg Branch */}
          <div className="col-md-6 mb-4">
            <h4 className="text-secondary">Durbar Marg</h4>
            <div className="map-container mb-3">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.2397084095984!2d85.3173215!3d27.7088757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb18fd856f5297%3A0x77f2c72fb3c7b561!2sDurbar%20Marg%2C%20Kathmandu!5e0!3m2!1sen!2snp!4v1738050874736!5m2!1sen!2snp"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Durbar Marg Branch Location"
              ></iframe>
            </div>
            <p>
              <strong>Email:</strong> info@durbarmarg.com
              <br />
              <strong>Phone:</strong> +977-(01)-4441234
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-youtube"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="mailto:info@durbarmarg.com" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-envelope-fill"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
