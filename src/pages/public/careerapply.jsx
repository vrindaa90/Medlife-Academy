import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./careerapply.css";

const API_URL = "https://medlife-academy.onrender.com/api/careers";

function CareerApply() {
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    applicantName: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    experience: "",
    company: "",
    designation: "",
    preferredLocation: "",
    address: "",
    source: "",
    resume: null,
  });

  /* =====================================================
     HANDLE TEXT INPUTS
  ===================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =====================================================
     HANDLE PHONE
  ===================================================== */

  const handlePhoneChange = (event) => {
    const value = event.target.value
      .replace(/\D/g, "")
      .slice(0, 10);

    setFormData((previous) => ({
      ...previous,
      phone: value,
    }));
  };

  /* =====================================================
     HANDLE RESUME
  ===================================================== */

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);

      setFormData((previous) => ({
        ...previous,
        resume: null,
      }));

      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF, DOC or DOCX file.");
      event.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      setError("Resume size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setSelectedFile(file);

    setFormData((previous) => ({
      ...previous,
      resume: file,
    }));
  };

  /* =====================================================
     REMOVE RESUME
  ===================================================== */

  const removeResume = () => {
    setSelectedFile(null);

    setFormData((previous) => ({
      ...previous,
      resume: null,
    }));

    const input = document.getElementById("resume");

    if (input) {
      input.value = "";
    }
  };

  /* =====================================================
     SUBMIT APPLICATION
  ===================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setError("");

    /* Required validation */

    if (!formData.applicantName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.phone.trim() || formData.phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!formData.position) {
      setError("Please select a position.");
      return;
    }

    if (!formData.department) {
      setError("Please select a department.");
      return;
    }

    if (!formData.resume) {
      setError("Please upload your resume.");
      return;
    }

    try {
      setSubmitting(true);

      /* =================================================
         FORM DATA
      ================================================= */

      const data = new FormData();

      data.append(
        "applicantName",
        formData.applicantName.trim()
      );

      data.append(
        "email",
        formData.email.trim()
      );

      data.append(
        "phone",
        formData.phone.trim()
      );

      data.append(
        "position",
        formData.position
      );

      data.append(
        "department",
        formData.department
      );

      data.append(
        "experience",
        formData.experience
      );

      data.append(
        "company",
        formData.company.trim()
      );

      data.append(
        "designation",
        formData.designation.trim()
      );

      data.append(
        "preferredLocation",
        formData.preferredLocation
      );

      data.append(
        "address",
        formData.address.trim()
      );

      data.append(
        "source",
        formData.source
      );

      data.append(
        "appliedOn",
        new Date().toISOString()
      );

      data.append(
        "status",
        "New"
      );

      data.append(
        "interviewStatus",
        "Not Scheduled"
      );

      data.append(
        "resume",
        formData.resume
      );

      /* =================================================
         SEND TO BACKEND
      ================================================= */

      const response = await fetch(API_URL, {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to submit your application."
        );
      }

      console.log(
        "Career application saved:",
        result.applicant
      );

      setSubmitted(true);

    } catch (err) {
      console.error(
        "Career application error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong while submitting your application."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =====================================================
     SUCCESS SCREEN
  ===================================================== */

  if (submitted) {
    return (
      <div className="career-apply-page">

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

              <Link to="/student-hub">
                Student Hub
              </Link>

              <Link
                className="active"
                to="/careers"
              >
                Careers
              </Link>

              <Link to="/contact">
                Contact Us
              </Link>
            </nav>
          </div>
        </header>

        <main className="career-success-section">
          <div className="career-success-card">

            <div className="success-icon">
              ✓
            </div>

            <div className="eyebrow">
              APPLICATION RECEIVED
            </div>

            <h1>
              Thank You for Applying!
            </h1>

            <p>
              Your career application has been
              successfully submitted to MedPath Academy.
              Our team will review your profile and
              contact you if your application moves
              forward.
            </p>

            <div className="success-actions">
              <button
                type="button"
                className="primary-btn"
                onClick={() =>
                  navigate("/careers")
                }
              >
                Back to Careers
              </button>

              <button
                type="button"
                className="secondary-btn"
                onClick={() =>
                  window.location.reload()
                }
              >
                Submit Another Application
              </button>
            </div>

          </div>
        </main>

        <footer>
          <div className="container">
            <div className="copyright">
              © 2026 MedPath Academy.
              All rights reserved.
            </div>
          </div>
        </footer>

      </div>
    );
  }

  /* =====================================================
     MAIN PAGE
  ===================================================== */

  return (
    <div className="career-apply-page">

      {/* =================================================
          NAVBAR
      ================================================= */}

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

            <Link to="/student-hub">
              Student Hub
            </Link>

            <Link
              className="active"
              to="/careers"
            >
              Careers
            </Link>

            <Link to="/contact">
              Contact Us
            </Link>

          </nav>
        </div>
      </header>

      {/* =================================================
          HERO
      ================================================= */}

      <section className="career-apply-hero">

        <div className="container">

          <div className="career-apply-hero-content">

            <div className="eyebrow">
              <span></span>
              JOIN MEDPATH
            </div>

            <h1>
              Start Your{" "}
              <span>MedPath Journey.</span>
            </h1>

            <p>
              Tell us about yourself and upload your
              resume. Our team will review your profile
              for current and future opportunities.
            </p>

          </div>

        </div>

      </section>

      {/* =================================================
          APPLICATION SECTION
      ================================================= */}

      <section className="career-apply-section">

        <div className="container career-apply-grid">

          {/* =================================================
              LEFT INFORMATION
          ================================================= */}

          <aside className="career-apply-info">

            <div className="info-card">

              <div className="info-icon">
                💼
              </div>

              <h2>
                Build Your Career
                With MedPath
              </h2>

              <p>
                We welcome passionate educators,
                counsellors, operations professionals,
                marketers, HR professionals and
                technology enthusiasts.
              </p>

            </div>

            <div className="steps-card">

              <h3>
                What Happens Next?
              </h3>

              <div className="career-step">
                <div className="step-number">
                  01
                </div>

                <div>
                  <strong>
                    Application
                  </strong>

                  <p>
                    Submit your details and resume.
                  </p>
                </div>
              </div>

              <div className="career-step">
                <div className="step-number">
                  02
                </div>

                <div>
                  <strong>
                    Screening
                  </strong>

                  <p>
                    Our team reviews your profile.
                  </p>
                </div>
              </div>

              <div className="career-step">
                <div className="step-number">
                  03
                </div>

                <div>
                  <strong>
                    Interview
                  </strong>

                  <p>
                    Shortlisted candidates are contacted.
                  </p>
                </div>
              </div>

              <div className="career-step">
                <div className="step-number">
                  04
                </div>

                <div>
                  <strong>
                    Welcome
                  </strong>

                  <p>
                    Begin your MedPath journey.
                  </p>
                </div>
              </div>

            </div>

          </aside>

          {/* =================================================
              APPLICATION FORM
          ================================================= */}

          <div className="career-form-card">

            <div className="form-header">

              <div className="eyebrow">
                APPLICATION FORM
              </div>

              <h2>
                Send Your Resume
              </h2>

              <p>
                Please provide accurate information
                so our team can review your application.
              </p>

            </div>

            {error && (
              <div className="career-form-error">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              noValidate
            >

              {/* =================================================
                  PERSONAL INFORMATION
              ================================================= */}

              <div className="form-section">

                <h3>
                  Personal Information
                </h3>

                <div className="form-grid">

                  <div className="form-group full-width">
                    <label htmlFor="applicantName">
                      Full Name *
                    </label>

                    <input
                      id="applicantName"
                      name="applicantName"
                      type="text"
                      value={formData.applicantName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      Email Address *
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      Phone Number *
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      placeholder="10-digit mobile number"
                      maxLength="10"
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="address">
                      Address
                    </label>

                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your current address"
                      rows="3"
                    />
                  </div>

                </div>

              </div>

              {/* =================================================
                  PROFESSIONAL INFORMATION
              ================================================= */}

              <div className="form-section">

                <h3>
                  Professional Information
                </h3>

                <div className="form-grid">

                  <div className="form-group">
                    <label htmlFor="position">
                      Position *
                    </label>

                    <select
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Select position
                      </option>

                      <option value="NEET Physics Faculty">
                        NEET Physics Faculty
                      </option>

                      <option value="NEET Biology Faculty">
                        NEET Biology Faculty
                      </option>

                      <option value="Chemistry Faculty">
                        Chemistry Faculty
                      </option>

                      <option value="Academic Coordinator">
                        Academic Coordinator
                      </option>

                      <option value="Academic Counsellor">
                        Academic Counsellor
                      </option>

                      <option value="Centre Operations Executive">
                        Centre Operations Executive
                      </option>

                      <option value="Digital Marketing Executive">
                        Digital Marketing Executive
                      </option>

                      <option value="HR Executive">
                        HR Executive
                      </option>

                      <option value="Website & IT Support Executive">
                        Website & IT Support Executive
                      </option>

                      <option value="Content & Social Media Intern">
                        Content & Social Media Intern
                      </option>

                      <option value="Student Support Executive">
                        Student Support Executive
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="department">
                      Department *
                    </label>

                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Select department
                      </option>

                      <option value="Academics">
                        Academics
                      </option>

                      <option value="Admissions">
                        Admissions
                      </option>

                      <option value="Operations">
                        Operations
                      </option>

                      <option value="Marketing">
                        Marketing
                      </option>

                      <option value="Human Resources">
                        Human Resources
                      </option>

                      <option value="Technology">
                        Technology
                      </option>

                      <option value="Content">
                        Content
                      </option>

                      <option value="Student Support">
                        Student Support
                      </option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="experience">
                      Experience
                    </label>

                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select experience
                      </option>

                      <option value="Fresher">
                        Fresher
                      </option>

                      <option value="0–1 Year">
                        0–1 Year
                      </option>

                      <option value="1–3 Years">
                        1–3 Years
                      </option>

                      <option value="2–5 Years">
                        2–5 Years
                      </option>

                      <option value="5+ Years">
                        5+ Years
                      </option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="preferredLocation">
                      Preferred Location
                    </label>

                    <select
                      id="preferredLocation"
                      name="preferredLocation"
                      value={formData.preferredLocation}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select location
                      </option>

                      <option value="Delhi">
                        Delhi
                      </option>

                      <option value="Noida">
                        Noida
                      </option>

                      <option value="Gurgaon">
                        Gurgaon
                      </option>

                      <option value="Remote">
                        Remote
                      </option>

                      <option value="Pan-India">
                        Pan-India
                      </option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="company">
                      Current / Previous Company
                    </label>

                    <input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Company / Institute name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="designation">
                      Current / Previous Designation
                    </label>

                    <input
                      id="designation"
                      name="designation"
                      type="text"
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="Your designation"
                    />
                  </div>

                </div>

              </div>

              {/* =================================================
                  SOURCE
              ================================================= */}

              <div className="form-section">

                <h3>
                  Application Details
                </h3>

                <div className="form-grid">

                  <div className="form-group full-width">

                    <label htmlFor="source">
                      How did you hear about us?
                    </label>

                    <select
                      id="source"
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select an option
                      </option>

                      <option value="MedPath Website">
                        MedPath Website
                      </option>

                      <option value="LinkedIn">
                        LinkedIn
                      </option>

                      <option value="Indeed">
                        Indeed
                      </option>

                      <option value="Naukri">
                        Naukri
                      </option>

                      <option value="Referral">
                        Employee / Friend Referral
                      </option>

                      <option value="Social Media">
                        Social Media
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </select>

                  </div>

                </div>

              </div>

              {/* =================================================
                  RESUME
              ================================================= */}

              <div className="form-section">

                <h3>
                  Resume
                </h3>

                <div className="resume-upload-box">

                  <input
                    id="resume"
                    name="resume"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleResumeChange}
                  />

                  <label
                    htmlFor="resume"
                    className="resume-upload-label"
                  >
                    <span className="upload-icon">
                      📄
                    </span>

                    <strong>
                      Upload Your Resume
                    </strong>

                    <span>
                      PDF, DOC or DOCX • Maximum 5 MB
                    </span>
                  </label>

                </div>

                {selectedFile && (
                  <div className="selected-file">

                    <div>
                      <strong>
                        {selectedFile.name}
                      </strong>

                      <span>
                        {(selectedFile.size / 1024 / 1024).toFixed(2)}
                        {" "}MB
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={removeResume}
                    >
                      Remove
                    </button>

                  </div>
                )}

              </div>

              {/* =================================================
                  SUBMIT
              ================================================= */}

              <div className="form-submit">

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={submitting}
                >
                  {submitting
                    ? "Submitting Application..."
                    : "Submit Application →"}
                </button>

                <p>
                  By submitting this form, you confirm that
                  the information provided is accurate.
                </p>

              </div>

            </form>

          </div>

        </div>

      </section>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer>
        <div className="container">

          <div className="footer-grid">

            <div>
              <Link
                className="footer-logo"
                to="/"
              >
                MedPath Academy
              </Link>

              <p className="footer-about">
                Helping aspiring doctors prepare smarter,
                learn better and move closer to their
                NEET dreams.
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
                Careers
              </h4>

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
            © 2026 MedPath Academy.
            All rights reserved.
          </div>

        </div>
      </footer>

    </div>
  );
}

export default CareerApply;