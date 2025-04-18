import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import "../Css/CV.css";

const CV = () => {
    const cvRef = useRef(null); // Assign reference
    const contentRef = useRef(null); // New contentRef for react-to-print

    const handleDownload = useReactToPrint({
        content: () => {
            console.log("cvRef.current:", cvRef.current);
            return cvRef.current || null;
        },
        documentTitle: "Sagar_Gurung_CV",
        copyStyles: true,
        contentRef, // Add this line
    });

    return (
        <>
            {/* Printable CV Content */}
            <div ref={(el) => { 
                cvRef.current = el; 
                contentRef.current = el; // Assign to contentRef as well
            }} style={{ padding: "20px", background: "white" }}>
                <div className="container cv-container py-5">
                    <div className="text-center mb-4 cv-header">
                        <h1 className="fw-bold text-light">SAGAR GURUNG</h1>
                        <p className="text-light">📞 +9779863322914 | ✉️ sgrgrg34@gmail.com</p>
                    </div>

                    <div className="cv-section">
                        <h2>PROFESSIONAL SUMMARY</h2>
                        <p> Aspiring MERN Stack Developer with hands-on experience...</p>
                    </div>

                    <div className="cv-section">
                        <h2>EDUCATION</h2>
                        <p><strong>ISMT College</strong> - Bachelor in Computer System Engineering (2023)</p>
                    </div>

                    <div className="cv-section">
                        <h2>TRAINING & CERTIFICATIONS</h2>
                        <p><strong>MERN Stack Training</strong> - Mindrisers (2025)</p>
                    </div>

                    <div className="cv-section">
                        <h2>INTERNSHIP EXPERIENCE</h2>
                        <ul>
                            <li>Full-stack development using MongoDB, Express.js, React.js, and Node.js.</li>
                            <li>Worked on front-end and back-end projects.</li>
                            <li>Collaborated on real-world applications.</li>
                        </ul>
                    </div>

                    <div className="cv-section">
                        <h2>PROJECTS</h2>
                        <p><strong>Coffee House</strong>: Developed a web-based platform for an online coffee shop.</p>
                        <p><strong>AI-Solution Business Website</strong>: Designed a website offering AI-powered solutions.</p>
                    </div>

                    <div className="cv-section">
                        <h2>TECHNICAL SKILLS</h2>
                        <ul>
                            <li>Frontend: React.js, HTML, CSS, JavaScript</li>
                            <li>Backend: Node.js, Express.js</li>
                            <li>Database: MongoDB</li>
                            <li>Version Control: Git, GitHub</li>
                        </ul>
                    </div>

                    <div className="cv-section">
                        <h2>SOFT SKILLS</h2>
                        <ul>
                            <li>Problem-solving</li>
                            <li>Team collaboration</li>
                            <li>Communication</li>
                            <li>Adaptability</li>
                        </ul>
                    </div>

                    <div className="cv-section">
                        <h2>ADDITIONAL INFORMATION</h2>
                        <ul>
                            <li>Experience in Agile methodologies.</li>
                            <li>Strong debugging skills.</li>
                            <li>Passion for learning new technologies.</li>
                            <li>Ability to work in a dynamic environment.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Download Button (Outside Printable Area) */}
            <div className="text-center mt-4">
                <button className="btn btn-light btn-lg cv-download" onClick={handleDownload}>
                    Download CV as PDF
                </button>
            </div>
        </>
    );
};

export default CV;
