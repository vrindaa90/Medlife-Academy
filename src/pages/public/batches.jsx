import { Link } from "react-router-dom";
import "./Batches.css";

function Batches() {
  return (
    <>
<header>
    <div className="container navbar">
    <Link to="/" className="logo">
        <div className="logo-mark">

        </div>

            MedPath
        
    </Link>
      <nav className="nav-links">

  <Link to="/">
    Home
  </Link>

  <Link to="/centers">
    Centers
  </Link>

  <Link to="/batches" className="active">
    Batches
  </Link>

  <Link to="/results">
    Results
  </Link>

  <Link to="/student-hub">
    Student Hub
  </Link>

  <Link to="/careers">
    Careers
  </Link>

  <Link to="/contact" className="nav-cta">
    Contact Us
  </Link>

      </nav>
    </div>
  </header>
  <section className="hero">
    <div className="container hero-content">
      <div className="eyebrow">
        <span></span>

            FIND YOUR PERFECT PROGRAM
        
      </div>
      <h1>

            Choose the Right
            
        <span>
NEET Program
        </span>

            for You
        
      </h1>
      <p>

            Whether you're starting your NEET journey, repeating for a better
            score, or preparing from home, we have a program designed around
            your goals.
        
      </p>
    </div>
  </section>
  <section className="program-section">
    <div className="container">
      <div className="section-heading">
        <h2>
Our NEET Programs
        </h2>
        <p>
Choose a learning path that fits your preparation stage.
        </p>
      </div>
      <div className="program-grid">
        <div className="program-card">
          <div className="program-icon">
📚
          </div>
          <h3>
NEET Foundation
          </h3>
          <p className="subtitle">

                    Build strong concepts from the beginning.
                
          </p>
          <div className="price">
            <small>
Course Fee
            </small>
            <strong>
₹75,000 
              <span>
/ year
              </span>
            </strong>
          </div>
          <div className="program-details">
            <div className="detail">
              <span>
Duration
              </span>
              <span>
2 Years
              </span>
            </div>
            <div className="detail">
              <span>
Mode
              </span>
              <span>
Classroom
              </span>
            </div>
            <div className="detail">
              <span>
Ideal For
              </span>
              <span>
Class 9–10
              </span>
            </div>
          </div>
          <div className="features">
            <h4>
What's Included
            </h4>
            <ul>
              <li>
NCERT-focused concept building
              </li>
              <li>
Regular tests &amp; assessments
              </li>
              <li>
Personalised academic guidance
              </li>
              <li>
Study material &amp; practice sheets
              </li>
              <li>
Doubt-solving sessions
              </li>
            </ul>
          </div>
          <Link to="/contact" className="enroll-btn">

                    Enroll Now →
                
          </Link>
        </div>
        <div className="program-card featured">
          <div className="popular">

                    MOST POPULAR
                
          </div>
          <div className="program-icon">
🎯
          </div>
          <h3>
NEET Target
          </h3>
          <p className="subtitle">

                    Complete preparation for your NEET attempt.
                
          </p>
          <div className="price">
            <small>
Course Fee
            </small>
            <strong>
₹1,20,000 
              <span>
/ year
              </span>
            </strong>
          </div>
          <div className="program-details">
            <div className="detail">
              <span>
Duration
              </span>
              <span>
1 Year
              </span>
            </div>
            <div className="detail">
              <span>
Mode
              </span>
              <span>
Classroom
              </span>
            </div>
            <div className="detail">
              <span>
Ideal For
              </span>
              <span>
Class 11–12
              </span>
            </div>
          </div>
          <div className="features">
            <h4>
What's Included
            </h4>
            <ul>
              <li>
Complete NEET syllabus coverage
              </li>
              <li>
Daily classroom learning
              </li>
              <li>
NEET-pattern test series
              </li>
              <li>
Personalised performance tracking
              </li>
              <li>
Expert faculty guidance
              </li>
            </ul>
          </div>
          <Link to="/contact" className="enroll-btn">

                    Enroll Now →
                
          </Link>
        </div>
        <div className="program-card">
          <div className="program-icon">
🚀
          </div>
          <h3>
NEET Dropper
          </h3>
          <p className="subtitle">

                    A focused year for your next NEET attempt.
                
          </p>
          <div className="price">
            <small>
Course Fee
            </small>
            <strong>
₹1,10,000 
              <span>
/ year
              </span>
            </strong>
          </div>
          <div className="program-details">
            <div className="detail">
              <span>
Duration
              </span>
              <span>
1 Year
              </span>
            </div>
            <div className="detail">
              <span>
Mode
              </span>
              <span>
Classroom
              </span>
            </div>
            <div className="detail">
              <span>
Ideal For
              </span>
              <span>
Droppers
              </span>
            </div>
          </div>
          <div className="features">
            <h4>
What's Included
            </h4>
            <ul>
              <li>
Complete syllabus revision
              </li>
              <li>
High-intensity practice
              </li>
              <li>
Full-length mock tests
              </li>
              <li>
Weak-area improvement plans
              </li>
              <li>
One-to-one academic support
              </li>
            </ul>
          </div>
          <Link to="/contact" className="enroll-btn">

                    Enroll Now →
                
          </Link>
        </div>
      </div>
    </div>
  </section>
  <section className="online-section">
    <div className="container online-grid">
      <div className="online-copy">
        <div className="eyebrow">
          <span></span>

                LEARN FROM ANYWHERE
            
        </div>
        <h2>

                Prefer studying
                
          <span>
online?
          </span>
        </h2>
        <p>

                Get complete NEET preparation from the comfort of your home.
                Access expert classes, study material, tests and doubt-solving
                support through our online program.
            
        </p>
        <div className="online-price">

                ₹49,999
                
          <span>
/ complete course
          </span>
        </div>
        <Link to="/contact" className="cta-button">

                Enroll in Online Prep →
            
        </Link>
      </div>
      <div className="online-card">
        <h3>
Online NEET Preparation
        </h3>
        <div className="online-features">
          <div className="online-feature">
            <span>
🎥
            </span>

                    Live Classes
                
          </div>
          <div className="online-feature">
            <span>
📖
            </span>

                    Digital Study Material
                
          </div>
          <div className="online-feature">
            <span>
📝
            </span>

                    Online Test Series
                
          </div>
          <div className="online-feature">
            <span>
💬
            </span>

                    Doubt Support
                
          </div>
          <div className="online-feature">
            <span>
📊
            </span>

                    Performance Tracking
                
          </div>
          <div className="online-feature">
            <span>
🎓
            </span>

                    Expert Faculty
                
          </div>
        </div>
        <Link to="/contact" className="enroll-btn">

                Enroll Now →
            
        </Link>
      </div>
    </div>
  </section>
  <section className="compare-section">
    <div className="container">
      <div className="section-heading">
        <h2>
Compare Our Programs
        </h2>
        <p>

                Not sure which program is right for you?
                Compare them at a glance.
            
        </p>
      </div>
      <div className="comparison-box">
        <div className="comparison-row comparison-head">
          <div>
Program Features
          </div>
          <div>
Foundation
          </div>
          <div>
Target
          </div>
          <div>
Dropper
          </div>
        </div>
        <div className="comparison-row">
          <div>
Concept Building
          </div>
          <div className="check">
✓
          </div>
          <div className="check">
✓
          </div>
          <div className="check">
✓
          </div>
        </div>
        <div className="comparison-row">
          <div>
NEET Test Series
          </div>
          <div className="check">
✓
          </div>
          <div className="check">
✓
          </div>
          <div className="check">
✓
          </div>
        </div>
        <div className="comparison-row">
          <div>
Performance Tracking
          </div>
          <div className="check">
✓
          </div>
          <div className="check">
✓
          </div>
          <div className="check">
✓
          </div>
        </div>
        <div className="comparison-row">
          <div>
Personalised Guidance
          </div>
          <div className="check">
✓
          </div>
          <div className="check">
✓
          </div>
          <div className="check">
✓
          </div>
        </div>
        <div className="comparison-row">
          <div>
Full Syllabus Revision
          </div>
          <div>
—
          </div>
          <div className="check">
✓
          </div>
          <div className="check">
✓
          </div>
        </div>
        <div className="comparison-row">
          <div>
Dropper-Focused Strategy
          </div>
          <div>
—
          </div>
          <div>
—
          </div>
          <div className="check">
✓
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
Still confused about which batch to choose?
          </h2>
          <p>

                    Talk to our counsellors and find a program that matches
                    your preparation level and NEET goals.
                
          </p>
        </div>
        <Link to="/contact" className="cta-button">

                Talk to a Counsellor →
            
        </Link>
      </div>
    </div>
  </section>
  <footer>
    <div className="container">
      <div className="footer-grid">
        <div>
          <Link to="/" className="footer-logo">

                    MedPath
                
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

          <h4>

          </h4>
          <ul>
            <li>
              <Link to="/student-hub">Student Hub</Link>
            </li>
            <li>
              <Link to="/careers">Careers</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>
Need Help?
          </h4>
          <ul>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
+91 98765 43210
            </li>
            <li>
hello@medpath.in
            </li>
          </ul>
        </div>
      </div>
      <div className="copyright">

            © 2026 MedPath. All rights reserved.
        
      </div>
    </div>
  </footer>
    </>
  )
}

export default Batches;
