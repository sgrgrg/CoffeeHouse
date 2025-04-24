import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import "../Css/CV.css";
import profilePic from "../assets/images/profile.png";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaDownload, FaBriefcase, FaGraduationCap, FaCertificate, FaProjectDiagram, FaTools } from "react-icons/fa";

const CV = () => {
    const cvRef = useRef(null);
    const contentRef = useRef(null);

    const handleDownload = useReactToPrint({
        content: () => cvRef.current || null,
        documentTitle: "Sagar_Gurung_CV",
        copyStyles: true,
        contentRef,
    });

    return (
        <>
            <div ref={(el) => {
                cvRef.current = el;
                contentRef.current = el;
            }} className="cv-printable-area">
                <div className="cv-container">
                    <div className="cv-header">
                        <div className="cv-profile-pic">
                            <img src={profilePic} alt="Profile" className="profile-image" />
                        </div>
                        <div className="cv-header-info">
                            <h1 className="cv-name">SAGAR GURUNG</h1>
                            <div className="cv-contact-info">
                                <div><FaPhone className="cv-icon" /> +977 9863 322914</div>
                                <div><FaEnvelope className="cv-icon" /> sgrgrg34@gmail.com</div>
                                <div><FaMapMarkerAlt className="cv-icon" /> Kathmandu, Nepal</div>
                            </div>
                        </div>
                    </div>

                    <div className="cv-main-content">
                        <div className="cv-left-column">
                            <section className="cv-section">
                                <h2>Professional Summary</h2>
                                <p>Experienced MERN Stack Developer with a proven track record in building dynamic, responsive, and user-friendly web applications. Developed the Coffee House e-commerce platform featuring real-time backend integration, interactive UI animations, and seamless user experience. Skilled in MongoDB, Express.js, React.js, and Node.js, with a strong focus on delivering high-quality software solutions.</p>
                            </section>

                            <section className="cv-section">
                                <h2>Education</h2>
                                <div className="cv-timeline">
                                    <div className="cv-timeline-item">
                                        <div className="cv-timeline-date">2023</div>
                                        <div className="cv-timeline-content">
                                            <strong>ISMT College</strong> - Bachelor of Computer System Engineering
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="cv-section">
                                <h2>Training & Certifications</h2>
                                <div className="cv-timeline">
                                    <div className="cv-timeline-item">
                                        <div className="cv-timeline-date">2025</div>
                                        <div className="cv-timeline-content">
                                            <strong>MERN Stack Development Training</strong> - Mindrisers
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="cv-section">
                                <h2>Internship Experience</h2>
                                <ul>
                                    <li>Developed and maintained the Coffee House website, implementing features such as dynamic menu display, backend API integration, and responsive design.</li>
                                    <li>Collaborated with designers and backend developers to enhance UI/UX and optimize performance.</li>
                                    <li>Implemented frontend animations using AOS library for engaging user interactions.</li>
                                    <li>Participated in code reviews and contributed to improving code quality and maintainability.</li>
                                </ul>
                            </section>
                        </div>

                        <div className="cv-right-column">
                            <section className="cv-section">
                                <h2>Projects</h2>
                                <p><strong>Coffee House</strong>: Developed a full-featured e-commerce platform for a local coffee shop, including dynamic menu management, social media integration, and smooth animations for enhanced user experience.</p>
                                <p><strong>AI-Solution Business Website</strong>: Created a modern website showcasing AI-powered solutions with interactive UI components and seamless user experience.</p>
                            </section>

                            <section className="cv-section">
                                <h2>Technical Skills</h2>
                                <div className="cv-skills">
                                    <div className="cv-skill">
                                        <span>React.js</span>
                                        <div className="cv-skill-bar">
                                            <div className="cv-skill-level" style={{ width: "85%" }}></div>
                                        </div>
                                    </div>
                                    <div className="cv-skill">
                                        <span>Node.js</span>
                                        <div className="cv-skill-bar">
                                            <div className="cv-skill-level" style={{ width: "75%" }}></div>
                                        </div>
                                    </div>
                                    <div className="cv-skill">
                                        <span>MongoDB</span>
                                        <div className="cv-skill-bar">
                                            <div className="cv-skill-level" style={{ width: "70%" }}></div>
                                        </div>
                                    </div>
                                    <div className="cv-skill">
                                        <span>JavaScript</span>
                                        <div className="cv-skill-bar">
                                            <div className="cv-skill-level" style={{ width: "80%" }}></div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="cv-section">
                                <h2>Soft Skills</h2>
                                <ul>
                                    <li>Strong problem-solving abilities with attention to detail.</li>
                                    <li>Effective team collaboration and communication skills.</li>
                                    <li>Adaptable and quick learner, eager to embrace new technologies.</li>
                                    <li>Time management and organizational skills to meet deadlines.</li>
                                </ul>
                            </section>

                            <section className="cv-section">
                                <h2>Additional Information</h2>
                                <ul>
                                    <li>Experience working in Agile development environments.</li>
                                    <li>Proficient in debugging and optimizing code for performance.</li>
                                    <li>Passionate about continuous learning and professional growth.</li>
                                    <li>Ability to work effectively in dynamic and fast-paced settings.</li>
                                </ul>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center mt-4">
                <button className="btn btn-light btn-lg cv-download" onClick={handleDownload}>
                    <FaDownload className="me-2" /> Download CV as PDF
                </button>
            </div>
        </>
    );
};

export default CV;
