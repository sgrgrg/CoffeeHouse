import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import "../Css/CV.css";
import profilePic from "../assets/images/profile.png";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaDownload, FaBriefcase, FaGraduationCap, FaCertificate, FaProjectDiagram, FaTools, FaLinkedin, FaGithub, FaMedium, FaLink } from "react-icons/fa";

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
<div className="cv-social-links">
    <a href="https://www.linkedin.com/in/baddepartment-gurung-b53659362/" target="_blank" rel="noopener noreferrer"><FaLinkedin className="cv-icon" /> LinkedIn</a>
    <a href="https://github.com/sgrgrg" target="_blank" rel="noopener noreferrer"><FaGithub className="cv-icon" /> GitHub</a>
    <a href="https://medium.com/@sgrgrg34" target="_blank" rel="noopener noreferrer"><FaMedium className="cv-icon" /> Medium</a>
    <a href="https://frontend-production-b728.up.railway.app/cv" target="_blank" rel="noopener noreferrer"><FaLink className="cv-icon" /> Portfolio</a>
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
                                        <div className="cv-timeline-date">Dec, 2020 - Present</div>
                                        <div className="cv-timeline-content">
                                            <strong>Bachelor City</strong><br />
                                            school_name<br />
                                            Mention your degree name with faculty<br />
                                            CGPA (if completed)
                                        </div>
                                    </div>
                                    <div className="cv-timeline-item">
                                        <div className="cv-timeline-date">Apr, 2018 - Apr, 2020</div>
                                        <div className="cv-timeline-content">
                                            <strong>NEB City</strong><br />
                                            school_name<br />
                                            which faculty / stream<br />
                                            you can mention your CGPA (optional)
                                        </div>
                                    </div>
                                    <div className="cv-timeline-item">
                                        <div className="cv-timeline-date">Jan, 2005 - Jan, 2018</div>
                                        <div className="cv-timeline-content">
                                            <strong>SEE City</strong><br />
                                            school name<br />
                                            you can mention your GPA (optional)
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="cv-section">
                                <h2>Training & Certifications</h2>
                                <div className="cv-timeline">
                                    <div className="cv-timeline-item">
                                        <div className="cv-timeline-date">2024</div>
                                        <div className="cv-timeline-content">
                                            <strong>Title of the training</strong><br />
                                            Mind Risers Consortium<br />
                                            Mention the details of the training and some notable skills you achieved. (2 lines max)<br />
                                            Credential links (Compulsory): <a href="https://www.mindrisers.com.np/certificate/validate/MR-80287-PD" target="_blank" rel="noopener noreferrer">https://www.mindrisers.com.np/certificate/validate/MR-80287-PD</a>
                                        </div>
                                    </div>
                                    <div className="cv-timeline-item">
                                        <div className="cv-timeline-date">2023</div>
                                        <div className="cv-timeline-content">
                                            <strong>Title of the training</strong><br />
                                            Company Name<br />
                                            Mention the details of the training and some notable skills you achieved. (2 lines max)<br />
                                            Credential links (if possible)
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="cv-section">
                                <h2>Achievements</h2>
                                <ul>
                                    <li>What did you achieve?</li>
                                    <li>Give a brief insight into how you achieved your milestone. This helps build your credibility!</li>
                                    <li>Credential links (if possible)</li>
                                </ul>
                            </section>

                            <section className="cv-section">
                                <h2>Awards</h2>
                                <div className="cv-timeline">
                                    <div className="cv-timeline-item">
                                        <div className="cv-timeline-date">2024</div>
                                        <div className="cv-timeline-content">
                                            <strong>Award Title</strong> - Location<br />
                                            CompanyName<br />
                                            Add a bit of background to your reward
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="cv-section">
                                <h2>Skills</h2>
                                <ul>
                                    <li>Add skills which you are confident of and can match the JD required skills too, SEO, MERN, Photoshop, Illustrator, Figma</li>
                                </ul>
                            </section>

                            <section className="cv-section">
                                <h2>Language</h2>
                                <p>English, Nepali, others</p>
                            </section>

                            <section className="cv-section">
                                <h2>References</h2>
                                <p>MindRisers<br />
                                MindRisers Institute of Technology<br />
                                Available upon request</p>
                                <p>Firstname Lastname - Manager<br />
                                CompanyName<br />
                                +977 xxxxxxxxxx<br />
                                mail@gmail.com</p>
                            </section>
                        </div>

                        <div className="cv-right-column">
                            <section className="cv-section">
                                <h2>Projects</h2>
                                <div>
                                    <strong>Project Name</strong><br />
                                    Overview of the project (Summary & Tech used) in 2-3 lines<br />
                                    Top 5/6 Key Features<br />
                                    <a href="https://github.com/link-to-github" target="_blank" rel="noopener noreferrer">link to your github or project domain</a>
                                </div>
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
