import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./contact.css";

function Contact() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
    query: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const mobile = formData.mobile.trim();

    if (!/^\d{10}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
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
          phone: mobile,
          city: formData.city.trim(),
          message: formData.query.trim(),
        }),
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to submit your query. Please try again."
        );
      }

      // Redirect ONLY after the backend confirms successful saving.
      navigate("/thank-you");
    } catch (submitError) {
      console.error("Contact form submission error:", submitError);

      setError(
        submitError.message ||
          "Something went wrong while submitting your query."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <header>
        <div className="container navbar">
          <a className="logo" href="/">
            <div className="logo-symbol">M</div>
            MedPath <span>Academy</span>
          </a>

          <nav className="nav-links">
            <a href="/">Home</a>
            <a href="/centers">Centers</a>
            <a href="/batches">Batches</a>
            <a href="/results">Results</a>
            <a href="/student-hub">Student Hub</a>
            <a href="/careers">Careers</a>

            <a className="nav-cta active" href="/contact">
              Contact Us
            </a>
          </nav>

          <div className="mobile-menu">☰</div>
        </div>
      </header>

      <section className="contact-hero">
        <div className="container">
          <div className="hero-label">WE&apos;RE HERE TO HELP</div>

          <h1>
            Let&apos;s Start Your 
            <span> NEET Journey</span>
          </h1>

          <p>
            Have questions about our batches, admissions, scholarships or
            centers? Reach out to us and our team will be happy to help.
          </p>
        </div>
      </section>

      <section className="contact-area">
        <div className="container contact-grid">
          <div className="contact-info-card">
            <div className="small-title">CONTACT MEDPATH ACADEMY</div>

            <h2>
              Have a question?
              <span>Talk to us.</span>
            </h2>

            <p>
              Fill out the form and our counselling team will get back to you
              with the information you need.
            </p>

            <div className="info-list">
              <div className="info-item">
                <div className="info-icon">📞</div>

                <div>
                  <strong>Call Us</strong>
                  <span>+91 98765 43210</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">✉</div>

                <div>
                  <strong>Email Us</strong>
                  <span>admissions@medpathacademy.in</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">⏰</div>

                <div>
                  <strong>Counselling Hours</strong>
                  <span>Monday – Saturday · 9 AM – 7 PM</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">📍</div>

                <div>
                  <strong>Our Centers</strong>
                  <span>Multiple learning centers across India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="form-card">
            <h2>Send Us Your Query</h2>

            <p>
              Please fill in your details and we&apos;ll get back to you
              shortly.
            </p>

            <form
              className="form"
              id="contactForm"
              onSubmit={handleSubmit}
            >
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    Full Name
                    <span className="required">*</span>
                  </label>

                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    type="text"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mobile">
                    Mobile Number
                    <span className="required">*</span>
                  </label>

                  <input
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    maxLength={10}
                    pattern="[0-9]{10}"
                    placeholder="Enter mobile number"
                    required
                    type="tel"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">
                    Email ID
                    <span className="required">*</span>
                  </label>

                  <input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
                    type="email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">
                    City
                    <span className="required">*</span>
                  </label>

                  <input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    required
                    type="text"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="query">
                  Your Query
                  <span className="required">*</span>
                </label>

                <textarea
                  id="query"
                  name="query"
                  value={formData.query}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  required
                ></textarea>
              </div>

              {error && (
                <div className="contact-error">
                  {error}
                </div>
              )}

              <button
                className="btn btn-primary submit-btn"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Query →"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer>
        <div className="container footer-grid">
          <div>
            <a className="logo footer-logo" href="/">
              <div className="logo-symbol">M</div>
              MedPath <span>Academy</span>
            </a>

            <p className="footer-description">
              Helping NEET aspirants learn better, prepare smarter and dream
              bigger.
            </p>
          </div>

          <div>
            <h4>Explore</h4>

            <ul>
              <li>
                <a href="/centers">Centers</a>
              </li>

              <li>
                <a href="/batches">Batches</a>
              </li>

              <li>
                <a href="/results">Results</a>
              </li>
            </ul>
          </div>

          <div>
            <h4>Students</h4>

            <ul>
              <li>
                <a href="/student-hub">Student Hub</a>
              </li>

              <li>
                <a href="#">Test Series</a>
              </li>

              <li>
                <a href="#">Study Resources</a>
              </li>

              <li>
                <a href="/careers">Careers</a>
              </li>
            </ul>
          </div>

          <div>
            <h4>Contact</h4>

            <ul>
              <li>
                <a href="/contact">Contact Us</a>
              </li>

              <li>
                <a href="#">Privacy Policy</a>
              </li>

              <li>
                <a href="#">Terms &amp; Conditions</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>© 2026 MedPath Academy. All rights reserved.</span>
          <span>Learn. Prepare. Achieve.</span>
        </div>
      </footer>
    </>
  );
}

export default Contact;