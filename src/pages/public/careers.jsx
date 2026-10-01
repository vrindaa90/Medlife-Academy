import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import "./Careers.css";

const jobs = [
  {
    id: 1,
    category: "academic",
    recent: true,
    type: "full-time",
    department: "ACADEMICS",
    title: "NEET Physics Faculty",
    description:
      "Teach Physics to NEET aspirants, develop conceptual understanding and guide students through regular assessments and doubt sessions.",
    location: "Delhi",
    experience: "2–5 Years",
    mode: "Classroom",
    posted: "Posted 2 days ago",
    newBadge: true,
  },
  {
    id: 2,
    category: "academic",
    recent: true,
    type: "full-time",
    department: "ACADEMICS",
    title: "NEET Biology Faculty",
    description:
      "Deliver engaging Biology classes, create topic-wise strategies and help students strengthen NCERT-based preparation.",
    location: "Delhi",
    experience: "2–5 Years",
    mode: "Classroom",
    posted: "Posted 3 days ago",
    newBadge: true,
  },
  {
    id: 3,
    category: "academic",
    recent: false,
    type: "part-time",
    department: "ACADEMICS",
    title: "Chemistry Faculty",
    description:
      "Teach Chemistry concepts, conduct revision sessions and support students through test analysis and academic mentoring.",
    location: "Delhi",
    experience: "2+ Years",
    mode: "Classroom",
    posted: "Posted 1 week ago",
    newBadge: false,
  },
  {
    id: 4,
    category: "academic",
    recent: false,
    type: "full-time",
    department: "ACADEMICS",
    title: "Academic Coordinator",
    description:
      "Coordinate faculty schedules, assessments, batch planning and academic communication across the center.",
    location: "Delhi",
    experience: "1–3 Years",
    mode: "On-Site",
    posted: "Posted 2 weeks ago",
    newBadge: false,
  },
  {
    id: 5,
    category: "non-academic",
    recent: true,
    type: "full-time",
    department: "ADMISSIONS",
    title: "Academic Counsellor",
    description:
      "Guide students and parents regarding batches, preparation plans, admissions and the right NEET program for their goals.",
    location: "Delhi",
    experience: "1–3 Years",
    mode: "Counselling",
    posted: "Posted 1 day ago",
    newBadge: true,
  },
  {
    id: 6,
    category: "non-academic",
    recent: true,
    type: "full-time",
    department: "OPERATIONS",
    title: "Centre Operations Executive",
    description:
      "Support day-to-day center operations, coordinate schedules, maintain records and ensure a smooth student experience.",
    location: "Delhi",
    experience: "1–3 Years",
    mode: "On-Site",
    posted: "Posted 3 days ago",
    newBadge: true,
  },
  {
    id: 7,
    category: "non-academic",
    recent: false,
    type: "full-time",
    department: "MARKETING",
    title: "Digital Marketing Executive",
    description:
      "Support digital campaigns, social media, content distribution and performance marketing initiatives for MedPath.",
    location: "Delhi / Hybrid",
    experience: "1–3 Years",
    mode: "Marketing",
    posted: "Posted 1 week ago",
    newBadge: false,
  },
  {
    id: 8,
    category: "non-academic",
    recent: false,
    type: "full-time",
    department: "HUMAN RESOURCES",
    title: "HR Executive",
    description:
      "Support recruitment, onboarding, employee records, engagement activities and HR coordination across MedPath teams.",
    location: "Delhi",
    experience: "1–3 Years",
    mode: "HR",
    posted: "Posted 2 weeks ago",
    newBadge: false,
  },
  {
    id: 9,
    category: "non-academic",
    recent: true,
    type: "full-time",
    department: "TECHNOLOGY",
    title: "Website & IT Support Executive",
    description:
      "Help maintain the institute website, student-facing systems, digital resources and internal technical support.",
    location: "Delhi / Hybrid",
    experience: "1–2 Years",
    mode: "Technology",
    posted: "Posted 4 days ago",
    newBadge: true,
  },
  {
    id: 10,
    category: "non-academic",
    recent: false,
    type: "internship",
    department: "CONTENT",
    title: "Content & Social Media Intern",
    description:
      "Assist with educational content, social media posts, student stories and digital communication.",
    location: "Delhi / Remote",
    experience: "0–1 Year",
    mode: "Content",
    posted: "Posted 3 weeks ago",
    newBadge: false,
  },
  {
    id: 11,
    category: "non-academic",
    recent: false,
    type: "full-time",
    department: "STUDENT SUPPORT",
    title: "Student Support Executive",
    description:
      "Assist students with batch-related queries, study resources, schedules and general learner support.",
    location: "Delhi",
    experience: "0–2 Years",
    mode: "Support",
    posted: "Posted 3 weeks ago",
    newBadge: false,
  },
];

function Careers() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filterJobs = (filter) => {
    setActiveFilter(filter);
  };

  const filteredJobs = useMemo(() => {
    switch (activeFilter) {
      case "recent":
        return jobs.filter((job) => job.recent);

      case "academic":
        return jobs.filter((job) => job.category === "academic");

      case "non-academic":
        return jobs.filter((job) => job.category === "non-academic");

      case "full-time":
        return jobs.filter((job) => job.type === "full-time");

      case "part-time":
        return jobs.filter((job) => job.type === "part-time");

      case "internship":
        return jobs.filter((job) => job.type === "internship");

      case "all":
      default:
        return jobs;
    }
  }, [activeFilter]);

  const getCountText = () => {
    const count = filteredJobs.length;
    return `Showing ${count} ${count === 1 ? "position" : "positions"}`;
  };

  return (
    <>
      {/* =====================================================
          NAVBAR
      ===================================================== */}
      <header>
        <div className="container navbar">
          <Link className="logo" to="/">
            <div className="logo-mark">M</div>
            MedPath Academy
          </Link>

          <nav className="nav-links">
            <Link to="/">Home</Link>

            <Link to="/centers">Centers</Link>

            <Link to="/batches">Batches</Link>

            <Link to="/results">Results</Link>

            <Link to="/student-hub">Student Hub</Link>

            <Link className="active" to="/careers">
              Careers
            </Link>

            <Link to="/contact">Contact Us</Link>
          </nav>
        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span></span>
              BUILD YOUR CAREER WITH US
            </div>

            <h1>
              Do Work That 
              <span> Moves Education Forward.</span>
            </h1>

            <p>
              At MedPath, great student outcomes begin with great people.
              Whether you're an educator, counsellor, marketer, operations
              professional or technology enthusiast, there's a place for
              your skills here.
            </p>

            <div className="hero-buttons">
              <a className="primary-btn" href="#openings">
                Explore Openings →
              </a>

              <Link className="secondary-btn" to="/career-apply">
                Send Your Resume
              </Link>
            </div>
          </div>

          <div className="career-main-card">
            <div className="career-icon">💼</div>

            <h3>Find Your Place at MedPath</h3>

            <p>
              Join a growing education team working across academics,
              operations, student experience, marketing and technology.
            </p>

            <div className="career-stats">
              <div className="career-stat">
                <strong>2</strong>
                <span>Career Categories</span>
              </div>

              <div className="career-stat">
                <strong>{jobs.length}</strong>
                <span>Open Roles</span>
              </div>

              <div className="career-stat">
                <strong>Delhi</strong>
                <span>Primary Centers</span>
              </div>

              <div className="career-stat">
                <strong>Pan-India</strong>
                <span>Online Opportunities</span>
              </div>
            </div>
          </div>

          <div className="floating-job two">
            💻 <span>Non-Academic</span> Roles
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ===================================================== */}
      <section className="intro-section">
        <div className="container">
          <div className="intro-box">
            <div>
              <h3>More Than Teaching</h3>

              <p>
                We hire across academics, student support, admissions,
                marketing, operations, HR, technology and other business
                functions.
              </p>
            </div>

            <div className="sample-label">OPENINGS</div>
          </div>
        </div>
      </section>

      {/* =====================================================
          JOB OPENINGS
      ===================================================== */}
      <section className="jobs-section" id="openings">
        <div className="container">
          <div className="section-heading center">
            <div className="eyebrow">
              <span></span>
              OPEN POSITIONS
            </div>

            <h2>
              Find a Role That <span>Fits You.</span>
            </h2>

            <p>
              Explore academic and non-academic opportunities across the
              MedPath team.
            </p>
          </div>

          {/* FILTER BOX */}
          <div className="filter-box">
            <div className="filter-top">
              <strong>Filter Opportunities</strong>

              <span className="job-count">
                {getCountText()}
              </span>
            </div>

            <div className="filter-buttons">
              <button
                type="button"
                className={`filter-btn ${
                  activeFilter === "all" ? "active" : ""
                }`}
                onClick={() => filterJobs("all")}
              >
                All
              </button>

              <button
                type="button"
                className={`filter-btn ${
                  activeFilter === "recent" ? "active" : ""
                }`}
                onClick={() => filterJobs("recent")}
              >
                Recently Posted
              </button>

              <button
                type="button"
                className={`filter-btn ${
                  activeFilter === "academic" ? "active" : ""
                }`}
                onClick={() => filterJobs("academic")}
              >
                Academic
              </button>

              <button
                type="button"
                className={`filter-btn ${
                  activeFilter === "non-academic" ? "active" : ""
                }`}
                onClick={() => filterJobs("non-academic")}
              >
                Non-Academic
              </button>

              <button
                type="button"
                className={`filter-btn ${
                  activeFilter === "full-time" ? "active" : ""
                }`}
                onClick={() => filterJobs("full-time")}
              >
                Full-Time
              </button>

              <button
                type="button"
                className={`filter-btn ${
                  activeFilter === "part-time" ? "active" : ""
                }`}
                onClick={() => filterJobs("part-time")}
              >
                Part-Time
              </button>

              <button
                type="button"
                className={`filter-btn ${
                  activeFilter === "internship" ? "active" : ""
                }`}
                onClick={() => filterJobs("internship")}
              >
                Internships
              </button>
            </div>
          </div>

          {/* JOB GRID */}
          <div className="job-grid">
            {filteredJobs.map((job) => (
              <div
                className="job-card"
                key={job.id}
              >
                <div className="job-top">
                  <span className="job-department">
                    {job.department}
                  </span>

                  {job.newBadge && (
                    <span className="new-badge">NEW</span>
                  )}
                </div>

                <h3>{job.title}</h3>

                <p className="job-description">
                  {job.description}
                </p>

                <div className="job-meta">
                  <span>📍 {job.location}</span>

                  <span>
                    {job.type === "full-time"
                      ? "Full-Time"
                      : job.type === "part-time"
                      ? "Part-Time"
                      : "Internship"}
                  </span>

                  <span>{job.experience}</span>

                  <span>{job.mode}</span>
                </div>

                <div className="job-bottom">
                  <span className="posted">{job.posted}</span>

                  <Link className="apply-btn" to="/career-apply">
                    Apply Now →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* NO RESULTS */}
          {filteredJobs.length === 0 && (
            <div className="no-results">
              <strong>No positions found</strong>

              <p>
                Try another filter to explore more opportunities.
              </p>

              <button
                type="button"
                className="filter-btn active"
                onClick={() => filterJobs("all")}
              >
                View All Positions
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          WHY JOIN MEDPATH
      ===================================================== */}
      <section className="why-section">
        <div className="container why-grid">
          <div className="why-copy">
            <div className="eyebrow">
              <span></span>
              LIFE AT MEDPATH
            </div>

            <h2>
              Grow with a team
              that <span>cares.</span>
            </h2>

            <p>
              Education is a people-first business. We want our faculty,
              operations teams, counsellors and support professionals to
              grow alongside the students they serve.
            </p>

            <Link className="primary-btn" to="/career-apply">
              Join Our Team →
            </Link>
          </div>

          <div className="benefit-grid">
            <div className="benefit">
              <div className="benefit-icon">📈</div>

              <h4>Career Growth</h4>

              <p>
                Opportunities to take on greater responsibility as you
                grow.
              </p>
            </div>

            <div className="benefit">
              <div className="benefit-icon">🤝</div>

              <h4>Collaborative Culture</h4>

              <p>
                Work closely with academic and non-academic teams.
              </p>
            </div>

            <div className="benefit">
              <div className="benefit-icon">🎓</div>

              <h4>Continuous Learning</h4>

              <p>
                Keep developing your professional and domain skills.
              </p>
            </div>

            <div className="benefit">
              <div className="benefit-icon">💡</div>

              <h4>Make an Impact</h4>

              <p>
                Your work contributes directly to students and their
                aspirations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HIRING PROCESS
      ===================================================== */}
      <section className="process-section">
        <div className="container">
          <div className="section-heading center">
            <div className="eyebrow">
              <span></span>
              HOW WE HIRE
            </div>

            <h2>
              A Simple <span>Hiring Process</span>
            </h2>

            <p>
              We want the process to be clear, professional and
              straightforward.
            </p>
          </div>

          <div className="process-grid">
            <div className="process-card">
              <div className="process-number">01</div>

              <h3>Apply</h3>

              <p>
                Submit your resume for a suitable opening.
              </p>
            </div>

            <div className="process-card">
              <div className="process-number">02</div>

              <h3>Screening</h3>

              <p>
                Our team reviews your profile and experience.
              </p>
            </div>

            <div className="process-card">
              <div className="process-number">03</div>

              <h3>Interview</h3>

              <p>
                Meet the relevant team and discuss the role.
              </p>
            </div>

            <div className="process-card">
              <div className="process-number">04</div>

              <h3>Welcome</h3>

              <p>
                Selected candidates begin their MedPath journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          GENERAL APPLICATION
      ===================================================== */}
      <section className="apply-section" id="apply">
        <div className="container">
          <div className="apply-box">
            <div className="apply-copy">
              <h2>Don't see the right role?</h2>

              <p>
                Send us your resume anyway. Tell us what you do best and
                how you would like to contribute to MedPath. We'll keep
                your profile in mind for future opportunities.
              </p>
            </div>

            <Link className="apply-button" to="/career-apply">
              Send Your Resume →
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div>
              <Link className="footer-logo" to="/">
                MedPath Academy
              </Link>

              <p className="footer-about">
                Helping aspiring doctors prepare smarter, learn better and
                move closer to their NEET dreams.
              </p>
            </div>

            <div>
              <h4>Explore</h4>

              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>

                <li>
                  <Link to="/centers">Centers</Link>
                </li>

                <li>
                  <Link to="/batches">Batches</Link>
                </li>

                <li>
                  <Link to="/results">Results</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4>Students</h4>

              <ul>
                <li>
                  <Link to="/student-hub">
                    Student Hub
                  </Link>
                </li>

                <li>
                  <Link to="/batches">Online Prep</Link>
                </li>

                <li>
                  <Link to="/results">Results</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4>Careers</h4>

              <ul>
                <li>
                  <Link to="/careers">
                    Open Positions
                  </Link>
                </li>

                <li>
                  <Link to="/career-apply">
                    Send Resume
                  </Link>
                </li>

                <li>
                  <Link to="/contact">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="copyright">
            © 2026 MedPath Academy. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}

export default Careers;