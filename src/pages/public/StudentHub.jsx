import { Link } from "react-router-dom";
import { useState } from "react";
import "./Student_Hub.css";

function StudentHub() {
  const [searchTerm, setSearchTerm] = useState("");

  const searchResources = (event) => {
    setSearchTerm(event.target.value);
  };

  const comingSoon = (event) => {
    event.preventDefault();
    window.alert("This feature is coming soon.");
  };

  return (
    <div className="student-hub-page">
<header>
<div className="container navbar">
<Link className="logo" to="/">
<div className="logo-mark">
                M
            </div>

            MedPath Academy

        </Link>
<nav className="nav-links">
<Link to="/">
                Home
            </Link>
<Link to="/centers">
                Centers
            </Link>
<Link to="/batches">
                Batches
            </Link>
<Link to="/results">
                Results
            </Link>
<Link className="active" to="/student-hub">
                Student Hub
            </Link>
<Link to="/careers">
                Careers
            </Link>
<Link to="/contact">
                Contact Us
            </Link>
</nav>
</div>
</header>

<section className="hero">
<div className="container hero-grid">
<div className="hero-copy">
<div className="eyebrow">
<span></span>

                YOUR LEARNING COMPANION

            </div>
<h1>

                Everything You Need
                <span>In One Place.</span>
</h1>
<p>

                Welcome to the MedPath Student Hub — your one-stop
                destination for NEET study material, exam resources,
                practice papers, preparation tools and important updates.

            </p>
<div className="hero-buttons">
<a className="primary-btn" href="#resources">
                    Explore Resources →
                </a>
<a className="secondary-btn" href="#documents">
                    Study Material
                    </a>
 

</div>
</div>

<div className="resource-preview">
<div className="floating-resource one">

                📄 NEET <span>Study Material</span>
</div>
<div className="preview-main">
<div className="preview-icon">
                    📚
                </div>
<h3>
                    Student Resource Hub
                </h3>
<p>

                    Notes, papers, tests and preparation
                    resources designed for your NEET journey.

                </p>
<div className="preview-lines">
<div className="preview-line"></div>
<div className="preview-line"></div>
<div className="preview-line"></div>
<div className="preview-line"></div>
</div>
</div>
<div className="floating-resource two">

                📝 <span>Mock Tests</span>
</div>
</div>
</div>
</section>

<section className="search-section">
<div className="container">
<div className="search-box">
<div className="search-icon">
                🔎
            </div>
<input id="resourceSearch" value={searchTerm} onChange={searchResources} placeholder="Search study material, tests, notes, NEET resources..." type="text" />
</div>
</div>
</section>

<section className="resources-section" id="resources">
<div className="container">
<div className="section-heading center">
<div className="eyebrow">
<span></span>

                STUDENT RESOURCES

            </div>
<h2>
                Prepare Better. <span>Study Smarter.</span>
</h2>
<p>
                Access the resources you need at every stage of your preparation.
            </p>
</div>
<div className="resource-grid" id="resourceGrid">

<div className="resource-card">
<div className="resource-top">
<div className="resource-icon">
                        📝
                    </div>
<div className="resource-tag">
                        EXAM
                    </div>
</div>
<h3>
                    NEET Answer Key
                </h3>
<p>
                    Access NEET answer keys and solutions to review
                    your performance after the examination.
                </p>
<div className="resource-meta">
<span className="meta">
                        NEET UG
                    </span>
<span className="meta">
                        PDF
                    </span>
<span className="meta">
                        2026
                    </span>
</div>
<a className="resource-button" href="/documents/neet-2026-answer-key.pdf" target="_blank" rel="noopener noreferrer">
                    View Answer Key →
                </a>
</div>

<div className="resource-card">
<div className="resource-top">
<div className="resource-icon">
                        🎯
                    </div>
<div className="resource-tag">
                        TOOL
                    </div>
</div>
<h3>
                    NEET Rank Predictor
                </h3>
<p>
                    Estimate your expected NEET rank using your
                    approximate score and understand your position.
                </p>
<div className="resource-meta">
<span className="meta">
                        NEET UG
                    </span>
<span className="meta">
                        Predictor
                    </span>
</div>
<button type="button" className="resource-button" onClick={comingSoon}>
                    Try Predictor →
                </button>
</div>

<div className="resource-card">
<div className="resource-top">
<div className="resource-icon">
                        🏫
                    </div>
<div className="resource-tag">
                        TOOL
                    </div>
</div>
<h3>
                    College Predictor
                </h3>
<p>
                    Explore possible medical college options based
                    on your expected score and category.
                </p>
<div className="resource-meta">
<span className="meta">
                        MBBS
                    </span>
<span className="meta">
                        Predictor
                    </span>
</div>
<button type="button" className="resource-button" onClick={comingSoon}>
                    Explore Colleges →
                </button>
</div>

<div className="resource-card">
<div className="resource-top">
<div className="resource-icon">
                        📊
                    </div>
<div className="resource-tag">
                        TOOL
                    </div>
</div>
<h3>
                    NEET Score Calculator
                </h3>
<p>
                    Calculate your estimated NEET score using
                    correct, incorrect and unanswered questions.
                </p>
<div className="resource-meta">
<span className="meta">
                        Calculator
                    </span>
<span className="meta">
                        NEET
                    </span>
</div>
<button type="button" className="resource-button" onClick={comingSoon}>
                    Calculate Score →
                </button>
</div>

<div className="resource-card">
<div className="resource-top">
<div className="resource-icon">
                        📖
                    </div>
<div className="resource-tag">
                        STUDY
                    </div>
</div>
<h3>
                    NCERT Solutions
                </h3>
<p>
                    Strengthen your concepts with chapter-wise
                    NCERT-based resources for Physics, Chemistry
                    and Biology.
                </p>
<div className="resource-meta">
<span className="meta">
                        Physics
                    </span>
<span className="meta">
                        Chemistry
                    </span>
<span className="meta">
                        Biology
                    </span>
</div>
<a className="resource-button" href="/documents/ncert-solutions.pdf" target="_blank" rel="noopener noreferrer">
                    View Solutions →
                </a>
</div>

<div className="resource-card">
<div className="resource-top">
<div className="resource-icon">
                        🧪
                    </div>
<div className="resource-tag">
                        PRACTICE
                    </div>
</div>
<h3>
                    NEET Mock Tests
                </h3>
<p>
                    Practice with NEET-style question papers
                    and test your preparation under exam-like conditions.
                </p>
<div className="resource-meta">
<span className="meta">
                        Full Syllabus
                    </span>
<span className="meta">
                        Practice
                    </span>
</div>
<a className="resource-button" href="/documents/neet-mock-test-01.pdf" target="_blank" rel="noopener noreferrer">
                    Start Practice →
                </a>
</div>
</div>
</div>
</section>

<section className="tools-section">
<div className="container">
<div className="section-heading center">
<div className="eyebrow">
<span></span>

                PREPARATION TOOLS

            </div>
<h2>
                Tools to Keep You <span>One Step Ahead</span>
</h2>
<p>
                Use these resources to understand your preparation and plan better.
            </p>
</div>
<div className="tools-grid">
<div className="tool-card">
<div className="tool-icon">
                    🎯
                </div>
<h3>
                    Rank Predictor
                </h3>
<p>
                    Get an estimated rank based on your score.
                </p>
<button type="button" className="tool-link" onClick={comingSoon}>
                    Explore →
                </button>
</div>
<div className="tool-card">
<div className="tool-icon">
                    🏥
                </div>
<h3>
                    College Predictor
                </h3>
<p>
                    Discover possible medical colleges.
                </p>
<button type="button" className="tool-link" onClick={comingSoon}>
                    Explore →
                </button>
</div>
<div className="tool-card">
<div className="tool-icon">
                    🧮
                </div>
<h3>
                    Score Calculator
                </h3>
<p>
                    Calculate your estimated NEET score.
                </p>
<button type="button" className="tool-link" onClick={comingSoon}>
                    Calculate →
                </button>
</div>
<div className="tool-card">
<div className="tool-icon">
                    📈
                </div>
<h3>
                    Performance Tracker
                </h3>
<p>
                    Keep track of your mock test performance.
                </p>
<button type="button" className="tool-link" onClick={comingSoon}>
                    Track →
                </button>
</div>
</div>
</div>
</section>

<section className="material-section" id="documents">
<div className="container material-layout">
<div className="material-copy">
<div className="eyebrow">
<span></span>

                STUDY MATERIAL

            </div>
<h2>

                Your Notes.
                Your Tests.
                <span>Your Preparation.</span>
</h2>
<p>

                Download useful preparation material and keep
                your important resources organised in one place.

            </p>
<div className="material-points">
<div className="material-point">
<span>✓</span>

                    NEET syllabus &amp; exam pattern

                </div>
<div className="material-point">
<span>✓</span>

                    Chapter-wise practice material

                </div>
<div className="material-point">
<span>✓</span>

                    Mock tests and previous papers

                </div>
<div className="material-point">
<span>✓</span>

                    Revision notes and important topics

                </div>
</div>
</div>

<div className="document-box">
<div className="document-header">
<h3>
                    Available Documents
                </h3>
<span>
                    PDF Resources
                </span>
</div>

<div className="document">
<div className="document-info">
<div className="file-icon">
                        📄
                    </div>
<div>
<strong>
                            NEET UG 2026 Syllabus
                        </strong>
<span>
                            Complete syllabus • PDF
                        </span>
</div>
</div>
<a className="download-btn" href="/documents/neet-2026-syllabus.pdf" target="_blank" rel="noopener noreferrer">
                    View PDF
                </a>
</div>

<div className="document">
<div className="document-info">
<div className="file-icon">
                        📄
                    </div>
<div>
<strong>
                            NEET 2026 Exam Pattern
                        </strong>
<span>
                            Pattern &amp; marking scheme • PDF
                        </span>
</div>
</div>
<a className="download-btn" href="/documents/neet-2026-exam-pattern.pdf" target="_blank" rel="noopener noreferrer">
                    View PDF
                </a>
</div>

<div className="document">
<div className="document-info">
<div className="file-icon">
                        📄
                    </div>
<div>
<strong>
                            Biology Revision Notes
                        </strong>
<span>
                            Important chapters • PDF
                        </span>
</div>
</div>
<a className="download-btn" href="/documents/biology-revision-notes.pdf" target="_blank" rel="noopener noreferrer">
                    View PDF
                </a>
</div>

<div className="document">
<div className="document-info">
<div className="file-icon">
                        📄
                    </div>
<div>
<strong>
                            Physics Formula Sheet
                        </strong>
<span>
                            Important formulas • PDF
                        </span>
</div>
</div>
<a className="download-btn" href="/documents/physics-formula-sheet.pdf" target="_blank" rel="noopener noreferrer">
                    View PDF
                </a>
</div>

<div className="document">
<div className="document-info">
<div className="file-icon">
                        📄
                    </div>
<div>
<strong>
                            Chemistry Quick Revision
                        </strong>
<span>
                            Important concepts • PDF
                        </span>
</div>
</div>
<a className="download-btn" href="/documents/chemistry-revision-notes.pdf" target="_blank" rel="noopener noreferrer">
                    View PDF
                </a>
</div>

<div className="document">
<div className="document-info">
<div className="file-icon">
                        📄
                    </div>
<div>
<strong>
                            NEET Practice Paper – 01
                        </strong>
<span>
                            Full-length practice test • PDF
                        </span>
</div>
</div>
<a className="download-btn" href="/documents/neet-practice-paper-01.pdf" target="_blank" rel="noopener noreferrer">
                    View PDF
                </a>
</div>
</div>
</div>
</section>

<section className="updates-section">
<div className="container updates-grid">
<div className="updates-copy">
<div className="eyebrow">
<span></span>

                EXAM UPDATES

            </div>
<h2>

                Stay Updated.
                <span>Stay Prepared.</span>
</h2>
<p>

                Keep an eye on important examination updates,
                preparation milestones and resources so that
                you never miss something important.

            </p>
</div>
<div className="update-list">
<div className="update-item">
<div className="update-date">
                    NEET<br />2026
                </div>
<div>
<strong>
                        NEET UG 2026 Preparation Resources
                    </strong>
<span>
                        Syllabus, study material and practice papers
                    </span>
</div>
</div>
<div className="update-item">
<div className="update-date">
                    TEST<br />01
                </div>
<div>
<strong>
                        Full-Length Mock Test Series
                    </strong>
<span>
                        Practice with exam-style questions
                    </span>
</div>
</div>
<div className="update-item">
<div className="update-date">
                    NEW
                </div>
<div>
<strong>
                        New Revision Material Added
                    </strong>
<span>
                        Chapter-wise revision resources
                    </span>
</div>
</div>
<div className="update-item">
<div className="update-date">
                    HUB
                </div>
<div>
<strong>
                        More Student Resources Coming Soon
                    </strong>
<span>
                        More tools and study material will be added
                    </span>
</div>
</div>
</div>
</div>
</section>

<section className="cta-section">
<div className="container">
<div className="cta-box">
<div>
<h2>
                    Need help with your preparation?
                </h2>
<p>
                    Talk to our counsellors and find the right
                    NEET program for your preparation journey.
                </p>
</div>
<Link className="cta-button" to="/contact">
                Talk to Us →
            </Link>
</div>
</div>
</section>

<footer>
<div className="container">
<div className="footer-grid">
<div>
<Link className="footer-logo" to="/">
                    MedPath Academy
                </Link>
<p className="footer-about">

                    Helping aspiring doctors prepare smarter,
                    learn better and move closer to their NEET dreams.

                </p>
</div>
<div>
<h4>
                    Explore
                </h4>
<ul>
<li>
<Link to="/">
                            Home
                        </Link>
</li>
<li>
<Link to="/centers">
                            Centers
                        </Link>
</li>
<li>
<Link to="/batches">
                            Batches
                        </Link>
</li>
<li>
<Link to="/results">
                            Results
                        </Link>
</li>
</ul>
</div>
<div>
<h4>
                    Students
                </h4>
<ul>
<li>
<Link to="/student-hub">
                            Student Hub
                        </Link>
</li>
<li>
<Link to="/batches">
                            Online Prep
                        </Link>
</li>
<li>
<Link to="/results">
                            Results
                        </Link>
</li>
</ul>
</div>
<div>
<h4>
                    Need Help?
                </h4>
<ul>
<li>
<Link to="/contact">
                            Contact Us
                        </Link>
</li>
<li>
                        +91 98765 43210
                    </li>
<li>
                        hello@medpath.in
                    </li>
<li>
                        New Delhi, India
                    </li>
</ul>
</div>
</div>
<div className="copyright">

            © 2026 MedPath Academy. All rights reserved.

        </div>
</div>
</footer>
    </div>
  );
}

export default StudentHub;
