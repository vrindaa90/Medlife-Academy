import { Link } from "react-router-dom";
import "./centers.css";

function Centers() {
  return (
    <div className="centers-page">
      {/* =========================
          NAVBAR
      ========================== */}
      <header className="centers-header">
        <div className="centers-container centers-navbar">
          <Link className="centers-logo" to="/">
            <div className="centers-logo-mark">M</div>
            <span>MedPath</span>
          </Link>

          <nav className="centers-nav">
            <Link to="/" className="centers-nav-link">
              Home
            </Link>

            <Link
              className="centers-nav-link centers-nav-active"
              to="/centers"
            >
              Centers
            </Link>

            <Link to="/batches" className="centers-nav-link">
              Batches
            </Link>

            <Link to="/results" className="centers-nav-link">
              Results
            </Link>

            <Link to="/student-hub" className="centers-nav-link">
              Student Hub
            </Link>

            <Link to="/careers" className="centers-nav-link">
              Careers
            </Link>

            <Link className="centers-nav-contact" to="/contact">
              Contact Us
            </Link>
          </nav>

          <div className="centers-mobile-menu">☰</div>
        </div>
      </header>

      <main>
        {/* =========================
            HERO
        ========================== */}
        <section className="centers-hero">
          <div className="centers-hero-glow centers-hero-glow-left"></div>
          <div className="centers-hero-glow centers-hero-glow-right"></div>

          <div className="centers-container centers-hero-content">
            <div className="centers-eyebrow">
              <span></span>
              OUR LEARNING CENTERS
            </div>

            <h1>
              Find Your Nearest{" "}
              <span>MedPath Center</span>
            </h1>

            <p>
              Learn from experienced faculty, study in a focused environment,
              and get the academic support you need at our Delhi learning
              centers.
            </p>
          </div>
        </section>

        {/* =========================
            CENTERS
        ========================== */}
        <section className="centers-list-section">
          <div className="centers-container">
            <div className="centers-section-heading">
              <div className="centers-section-label">CENTERS</div>

              <h2>Our Delhi Centers</h2>

              <p>
                Five convenient locations designed to make your NEET
                preparation easier.
              </p>
            </div>

            <div className="centers-grid">
              {/* CENTER 1 */}
              <div className="center-card">
                <div className="center-visual">
                  <div className="center-building">
                    <div className="center-windows">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>

                  <div className="center-location-tag">NORTH DELHI</div>
                </div>

                <div className="center-content">
                  <h3>North Delhi</h3>

                  <p className="center-address">
                    Model Town, North Delhi,
                    <br />
                    New Delhi – 110009
                  </p>

                  <div className="center-info">
                    <div className="center-info-row">
                      <span>Timings</span>
                      <strong>8 AM – 8 PM</strong>
                    </div>

                    <div className="center-info-row">
                      <span>Classes</span>
                      <strong>9th – 12th</strong>
                    </div>
                  </div>

                  <Link className="center-direction-link" to="/contact">
                    Enquire about Center <span>→</span>
                  </Link>
                </div>
              </div>

              {/* CENTER 2 */}
              <div className="center-card">
                <div className="center-visual">
                  <div className="center-building">
                    <div className="center-windows">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>

                  <div className="center-location-tag">SOUTH DELHI</div>
                </div>

                <div className="center-content">
                  <h3>South Delhi</h3>

                  <p className="center-address">
                    Lajpat Nagar, South Delhi,
                    <br />
                    New Delhi – 110024
                  </p>

                  <div className="center-info">
                    <div className="center-info-row">
                      <span>Timings</span>
                      <strong>8 AM – 8 PM</strong>
                    </div>

                    <div className="center-info-row">
                      <span>Classes</span>
                      <strong>9th – 12th</strong>
                    </div>
                  </div>

                  <Link className="center-direction-link" to="/contact">
                    Enquire about Center <span>→</span>
                  </Link>
                </div>
              </div>

              {/* CENTER 3 */}
              <div className="center-card">
                <div className="center-visual">
                  <div className="center-building">
                    <div className="center-windows">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>

                  <div className="center-location-tag">EAST DELHI</div>
                </div>

                <div className="center-content">
                  <h3>East Delhi</h3>

                  <p className="center-address">
                    Preet Vihar, East Delhi,
                    <br />
                    New Delhi – 110092
                  </p>

                  <div className="center-info">
                    <div className="center-info-row">
                      <span>Timings</span>
                      <strong>8 AM – 8 PM</strong>
                    </div>

                    <div className="center-info-row">
                      <span>Classes</span>
                      <strong>9th – 12th</strong>
                    </div>
                  </div>

                  <Link className="center-direction-link" to="/contact">
                    Enquire about Center <span>→</span>
                  </Link>
                </div>
              </div>

              {/* CENTER 4 */}
              <div className="center-card">
                <div className="center-visual">
                  <div className="center-building">
                    <div className="center-windows">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>

                  <div className="center-location-tag">WEST DELHI</div>
                </div>

                <div className="center-content">
                  <h3>West Delhi</h3>

                  <p className="center-address">
                    Rajouri Garden, West Delhi,
                    <br />
                    New Delhi – 110027
                  </p>

                  <div className="center-info">
                    <div className="center-info-row">
                      <span>Timings</span>
                      <strong>8 AM – 8 PM</strong>
                    </div>

                    <div className="center-info-row">
                      <span>Classes</span>
                      <strong>9th – 12th</strong>
                    </div>
                  </div>

                  <Link className="center-direction-link" to="/contact">
                    Enquire about Center <span>→</span>
                  </Link>
                </div>
              </div>

              {/* CENTER 5 */}
              <div className="center-card">
                <div className="center-visual">
                  <div className="center-building">
                    <div className="center-windows">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>

                  <div className="center-location-tag">CENTRAL DELHI</div>
                </div>

                <div className="center-content">
                  <h3>Central Delhi</h3>

                  <p className="center-address">
                    Karol Bagh, Central Delhi,
                    <br />
                    New Delhi – 110005
                  </p>

                  <div className="center-info">
                    <div className="center-info-row">
                      <span>Timings</span>
                      <strong>8 AM – 8 PM</strong>
                    </div>

                    <div className="center-info-row">
                      <span>Classes</span>
                      <strong>9th – 12th</strong>
                    </div>
                  </div>

                  <Link className="center-direction-link" to="/contact">
                    Enquire about Center <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            WHY OUR CENTERS
        ========================== */}
        <section className="centers-why-section">
          <div className="centers-container centers-why-grid">
            <div className="centers-why-copy">
              <div className="centers-eyebrow centers-eyebrow-dark">
                <span></span>
                MORE THAN A CLASSROOM
              </div>

              <h2>
                A place built for{" "}
                <span>focused preparation.</span>
              </h2>

              <p>
                Our centers are designed to give students an environment where
                they can focus completely on their NEET preparation, interact
                with faculty, solve doubts and stay motivated throughout their
                journey.
              </p>
            </div>

            <div className="centers-benefits">
              <div className="centers-benefit">
                <div className="centers-benefit-icon">👨‍🏫</div>

                <h4>Expert Faculty</h4>

                <p>Learn from experienced NEET educators.</p>
              </div>

              <div className="centers-benefit">
                <div className="centers-benefit-icon">📚</div>

                <h4>Study Resources</h4>

                <p>
                  Access structured study material and practice.
                </p>
              </div>

              <div className="centers-benefit">
                <div className="centers-benefit-icon">💬</div>

                <h4>Doubt Support</h4>

                <p>Get your academic questions answered regularly.</p>
              </div>

              <div className="centers-benefit">
                <div className="centers-benefit-icon">📊</div>

                <h4>Progress Tracking</h4>

                <p>
                  Understand your preparation through regular assessments.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            ONLINE COACHING
        ========================== */}
        <section className="centers-online-section">
          <div className="centers-container centers-online-content">
            <div className="centers-eyebrow">
              <span></span>
              PAN-INDIA COACHING
            </div>

            <h2>
              Not in Delhi?{" "}
              <span>We've got you covered.</span>
            </h2>

            <p>
              Your location shouldn't limit your NEET preparation. Join MedPath
              Online and access quality NEET coaching from anywhere in India.
            </p>

            <div className="centers-online-points">
              <div>🎥 Live Classes</div>
              <div>📖 Digital Study Material</div>
              <div>📝 Online Tests</div>
              <div>💬 Doubt Support</div>
              <div>📊 Performance Tracking</div>
            </div>

            <Link className="centers-online-button" to="/contact">
              Explore Online Coaching <span>→</span>
            </Link>
          </div>
        </section>

        {/* =========================
            CTA
        ========================== */}
        <section className="centers-cta-section">
          <div className="centers-container">
            <div className="centers-cta-box">
              <div>
                <h2>Want to visit a center?</h2>

                <p>
                  Talk to our counsellors to know about batches, timings, fees
                  and admissions.
                </p>
              </div>

              <Link className="centers-cta-button" to="/contact">
                Contact Us <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* =========================
          FOOTER
      ========================== */}
      <footer className="centers-footer">
        <div className="centers-container">
          <div className="centers-footer-grid">
            <div>
              <Link className="centers-footer-logo" to="/">
                MedPath
              </Link>

              <p className="centers-footer-about">
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
              <h4>Student</h4>

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
              <h4>Need Help?</h4>

              <ul>
                <li>
                  <Link to="/contact">Contact Us</Link>
                </li>

                <li>+91 98765 43210</li>

                <li>hello@medpath.in</li>
              </ul>
            </div>
          </div>

          <div className="centers-copyright">
            © 2026 MedPath. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Centers;