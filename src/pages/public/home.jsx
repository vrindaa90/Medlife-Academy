import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./home.css";

function Home() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
    query: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (formError) {
      setFormError("");
    }
  };

  const handleMobileChange = (event) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 10);

    setFormData((previous) => ({
      ...previous,
      mobile: value,
    }));

    if (formError) {
      setFormError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Please enter your name.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.mobile)) {
      setFormError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!formData.email.trim()) {
      setFormError("Please enter your email address.");
      return;
    }

    if (!formData.city.trim()) {
      setFormError("Please enter your city.");
      return;
    }

    if (!formData.query.trim()) {
      setFormError("Please enter your query.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("http://localhost:5000/api/queries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.mobile,
          city: formData.city.trim(),
          message: formData.query.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to submit your query right now."
        );
      }

      navigate("/thank-you");
    } catch (error) {
      setFormError(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="home-page">
      {/* =========================
          HEADER
      ========================== */}
      <header className="home-header">
        <div className="home-container home-navbar">
          <Link to="/" className="home-logo">
            <div className="home-logo-symbol">M</div>

            <div className="home-logo-text">
              MedPath <span>academy</span>
            </div>
          </Link>

          <nav className="home-nav">
            <Link to="/" className="home-nav-link home-nav-active">
              Home
            </Link>

            <Link to="/centers" className="home-nav-link">
              Centers
            </Link>

            <Link to="/batches" className="home-nav-link">
              Batches
            </Link>

            <Link to="/results" className="home-nav-link">
              Results
            </Link>

            <Link to="/student-hub" className="home-nav-link">
              Student Hub
            </Link>

            <Link to="/careers" className="home-nav-link">
              Careers
            </Link>

            <Link to="/contact" className="home-nav-contact">
              Contact Us
            </Link>
          </nav>

          <div className="home-mobile-menu">☰</div>
        </div>
      </header>

      <main>
        {/* =========================
            HERO
        ========================== */}
        <section className="home-hero">
          <div className="home-container home-hero-grid">
            <div className="home-hero-content">
              <div className="home-hero-tag">
                <span className="home-hero-dot"></span>
                <span>NEET 2027 • ADMISSIONS OPEN</span>
              </div>

              <h1 className="home-hero-title">
                <span>Your Dream of</span>
                <span className="home-blue-text">Becoming a Doctor</span>
                <span>Starts Here.</span>
              </h1>

              <p className="home-hero-description">
                Build stronger concepts, prepare with confidence, and get the
                guidance you need to take your NEET preparation to the next
                level.
              </p>

              <div className="home-hero-buttons">
                <Link to="/batches" className="home-btn home-btn-primary">
                  Explore Batches <span>→</span>
                </Link>

                <Link to="/contact" className="home-btn home-btn-secondary">
                  Talk to an Expert
                </Link>
              </div>

              <div className="home-trust-row">
                <span>
                  <b>✓</b>
                  Expert Faculty
                </span>

                <span>
                  <b>✓</b>
                  Regular Tests
                </span>

                <span>
                  <b>✓</b>
                  Personal Mentoring
                </span>
              </div>
            </div>

            <div className="home-hero-visual">
              <div className="home-student-card">
                <div className="home-student-circle-one"></div>
                <div className="home-student-circle-two"></div>

                <div className="home-student">
                  <div className="home-student-head"></div>

                  <div className="home-student-body">
                    <div className="home-coat-line"></div>
                    <div className="home-stethoscope"></div>
                  </div>
                </div>
              </div>

              <div className="home-floating-card home-rank-card">
                <small>YOUR GOAL</small>
                <strong>NEET 2027</strong>
              </div>

              <div className="home-floating-card home-selection-card">
                <small>STUDENT SUCCESS</small>
                <strong>98%+*</strong>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            STATS
        ========================== */}
        <section className="home-stats">
          <div className="home-container">
            <div className="home-stats-box">
              <div className="home-stat">
                <strong>15+</strong>
                <span>Years of Excellence</span>
              </div>

              <div className="home-stat">
                <strong>50K+</strong>
                <span>Students Guided</span>
              </div>

              <div className="home-stat">
                <strong>100+</strong>
                <span>Expert Mentors</span>
              </div>

              <div className="home-stat">
                <strong>25+</strong>
                <span>Learning Centers</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            WHY MEDPATH
        ========================== */}
        <section className="home-section home-why-section">
          <div className="home-container">
            <div className="home-section-head">
              <div className="home-section-label">WHY MEDPATH</div>

              <h2>
                Everything You Need to{" "}
                <span>Prepare Better</span>
              </h2>

              <p>
                A focused learning ecosystem built around the needs of
                ambitious NEET aspirants.
              </p>
            </div>

            <div className="home-features">
              <div className="home-feature">
                <div className="home-feature-icon">🎓</div>

                <h3>Expert Faculty</h3>

                <p>
                  Learn difficult concepts from experienced educators who make
                  learning simpler.
                </p>
              </div>

              <div className="home-feature">
                <div className="home-feature-icon">📚</div>

                <h3>Smart Study Material</h3>

                <p>
                  Structured notes and practice material designed for focused
                  NEET preparation.
                </p>
              </div>

              <div className="home-feature">
                <div className="home-feature-icon">📊</div>

                <h3>Performance Tracking</h3>

                <p>
                  Understand your progress and identify areas where you need to
                  improve.
                </p>
              </div>

              <div className="home-feature">
                <div className="home-feature-icon">🤝</div>

                <h3>Personal Mentoring</h3>

                <p>
                  Stay motivated with guidance and support throughout your
                  preparation journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            PROGRAMS
        ========================== */}
        <section className="home-section home-program-section">
          <div className="home-container">
            <div className="home-section-head">
              <div className="home-section-label">OUR PROGRAMS</div>

              <h2>
                Find Your Perfect{" "}
                <span>NEET Program</span>
              </h2>

              <p>
                Choose a program designed according to your stage of
                preparation.
              </p>
            </div>

            <div className="home-program-grid">
              <div className="home-program-card">
                <span className="home-program-tag">CLASS 11</span>

                <h3>NEET Foundation</h3>

                <p>
                  Start early and build strong concepts while balancing your
                  school curriculum.
                </p>

                <ul>
                  <li>2-year structured preparation</li>
                  <li>Concept-focused classes</li>
                  <li>Regular chapter tests</li>
                  <li>Personalised mentoring</li>
                </ul>

                <Link to="/batches" className="home-program-link">
                  Explore Program <span>→</span>
                </Link>
              </div>

              <div className="home-program-card home-popular-card">
                <div className="home-popular-label">MOST POPULAR</div>

                <span className="home-program-tag">CLASS 12</span>

                <h3>NEET Achiever</h3>

                <p>
                  Complete your syllabus and prepare confidently for the final
                  NEET attempt.
                </p>

                <ul>
                  <li>Complete syllabus coverage</li>
                  <li>Full-length mock tests</li>
                  <li>Revision sessions</li>
                  <li>Doubt-solving support</li>
                </ul>

                <Link to="/batches" className="home-program-link">
                  Explore Program <span>→</span>
                </Link>
              </div>

              <div className="home-program-card">
                <span className="home-program-tag">DROPPERS</span>

                <h3>NEET 2.0</h3>

                <p>
                  An intensive preparation program for students taking another
                  attempt.
                </p>

                <ul>
                  <li>Intensive classroom learning</li>
                  <li>Advanced test series</li>
                  <li>Performance analysis</li>
                  <li>One-on-one mentoring</li>
                </ul>

                <Link to="/batches" className="home-program-link">
                  Explore Program <span>→</span>
                </Link>
              </div>
            </div>

            <div className="home-more-programs">
              <Link to="/batches" className="home-btn home-btn-secondary">
                Explore More Programs <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* =========================
            RESULTS
        ========================== */}
        <section className="home-section home-results">
          <div className="home-container home-results-grid">
            <div className="home-results-content">
              <div className="home-section-label">OUR RESULTS</div>

              <h2>
                Results That{" "}
                <span>Speak for Themselves</span>
              </h2>

              <p>
                Every result represents months of discipline, consistent effort
                and the right guidance.
              </p>

              <Link to="/results" className="home-btn home-btn-primary">
                View Our Results <span>→</span>
              </Link>
            </div>

            <div className="home-result-cards">
              <div className="home-result-card">
                <strong>98%+</strong>
                <span>Student Success Rate*</span>
              </div>

              <div className="home-result-card">
                <strong>500+</strong>
                <span>Students in 600+*</span>
              </div>

              <div className="home-result-card">
                <strong>10K+</strong>
                <span>Successful Selections*</span>
              </div>

              <div className="home-result-card">
                <strong>Top 100</strong>
                <span>NEET Ranks*</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            STUDENT HUB
        ========================== */}
        <section className="home-section home-hub-section">
          <div className="home-container">
            <div className="home-section-head">
              <div className="home-section-label">STUDENT HUB</div>

              <h2>
                Your Learning,{" "}
                <span>All in One Place</span>
              </h2>

              <p>
                Resources and tools that help you stay organised throughout
                your preparation.
              </p>
            </div>

            <div className="home-hub">
              <Link to="#" className="home-hub-item">
                <div className="home-hub-icon">📖</div>

                <div>
                  <h3>Study Resources</h3>
                  <p>
                    Notes, revision material and practice resources
                  </p>
                </div>

                <span className="home-hub-arrow">→</span>
              </Link>

              <Link to="#" className="home-hub-item">
                <div className="home-hub-icon">📝</div>

                <div>
                  <h3>Test Series</h3>
                  <p>Practice tests and performance evaluation</p>
                </div>

                <span className="home-hub-arrow">→</span>
              </Link>

              <Link to="/student-hub" className="home-hub-item">
                <div className="home-hub-icon">📅</div>

                <div>
                  <h3>Study Planner</h3>
                  <p>Plan your preparation and track consistency</p>
                </div>

                <span className="home-hub-arrow">→</span>
              </Link>

              <Link to="#" className="home-hub-item">
                <div className="home-hub-icon">💬</div>

                <div>
                  <h3>Doubt Support</h3>
                  <p>Get academic support whenever you need it</p>
                </div>

                <span className="home-hub-arrow">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* =========================
            CAREERS
        ========================== */}
        <section className="home-careers-section">
          <div className="home-container">
            <div className="home-careers-card">
              <div>
                <div className="home-section-label">CAREERS</div>

                <h2>
                  Build the Future{" "}
                  <span>With Us.</span>
                </h2>

                <p>
                  Join our growing academic and operations team and help shape
                  the next generation.
                </p>
              </div>

              <Link to="/careers" className="home-btn home-btn-secondary">
                Explore Careers <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* =========================
            CONTACT
        ========================== */}
        <section className="home-section home-contact-section">
          <div className="home-container">
            <div className="home-contact-grid">
              <div className="home-contact-copy">
                <div className="home-section-label">GET IN TOUCH</div>

                <h2>
                  Let's Start Your{" "}
                  <span>NEET Journey</span>
                </h2>

                <p>
                  Have questions about batches, fees, scholarships or centers?
                  Share your details and our counsellor will get in touch with
                  you.
                </p>

                <div className="home-contact-info">
                  <div className="home-contact-info-item">
                    <div className="home-contact-icon">📞</div>

                    <div>
                      <strong>+91 98765 43210</strong>
                      <small>Mon – Sat, 9 AM – 7 PM</small>
                    </div>
                  </div>

                  <div className="home-contact-info-item">
                    <div className="home-contact-icon">✉</div>

                    <div>
                      <strong>admissions@medpathacademy.in</strong>
                      <small>We'll respond shortly</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="home-contact-form-card">
                <h3>Send Us Your Query</h3>

                <p className="home-form-intro">
                  Please fill in your details and we'll get back to you
                  shortly.
                </p>

                {formError && (
                  <div className="home-form-error">{formError}</div>
                )}

                <form
                  className="home-contact-form"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className="home-form-row">
                    <div className="home-form-group">
                      <label htmlFor="homeName">Full Name</label>

                      <input
                        id="homeName"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                      />
                    </div>

                    <div className="home-form-group">
                      <label htmlFor="homeMobile">Mobile Number</label>

                      <input
                        id="homeMobile"
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleMobileChange}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>

                  <div className="home-form-row">
                    <div className="home-form-group">
                      <label htmlFor="homeEmail">Email Address</label>

                      <input
                        id="homeEmail"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div className="home-form-group">
                      <label htmlFor="homeCity">City</label>

                      <input
                        id="homeCity"
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter your city"
                        required
                      />
                    </div>
                  </div>

                  <div className="home-form-group">
                    <label htmlFor="homeQuery">Your Query</label>

                    <textarea
                      id="homeQuery"
                      name="query"
                      value={formData.query}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                      rows="4"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="home-btn home-btn-primary home-submit-btn"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Query"}
                    {!submitting && <span>→</span>}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================
          FOOTER
      ========================== */}
      <footer className="home-footer">
        <div className="home-container home-footer-grid">
          <div>
            <Link to="/" className="home-logo home-footer-logo">
              <div className="home-logo-symbol">M</div>

              <div className="home-logo-text">
                MedPath <span>academy</span>
              </div>
            </Link>

            <p className="home-footer-description">
              Helping NEET aspirants learn better, prepare smarter and dream
              bigger.
            </p>
          </div>

          <div>
            <h4>Explore</h4>

            <ul>
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
                <Link to="/student-hub">Student Hub</Link>
              </li>

              <li>
                <Link to="#">Test Series</Link>
              </li>

              <li>
                <Link to="#">Study Resources</Link>
              </li>

              <li>
                <Link to="/careers">Careers</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Contact</h4>

            <ul>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>

              <li>
                <Link to="#">Privacy Policy</Link>
              </li>

              <li>
                <Link to="#">Terms &amp; Conditions</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="home-container home-footer-bottom">
          <span>© 2026 MedPath Academy. All rights reserved.</span>
          <span>Learn. Prepare. Achieve.</span>
        </div>
      </footer>
    </div>
  );
}

export default Home;