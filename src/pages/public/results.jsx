import { Link } from "react-router-dom";
import { useState } from "react";
import "./Result.css";

const resultsByYear = {
  2026: {
    title: "NEET 2026 — Top 10 Performers",
    students: [
      {
        rank: 1,
        name: "Aarav Sharma",
        score: 712,
        air: 7,
        batch: "Class 11 Batch",
      },
      {
        rank: 2,
        name: "Riya Mehta",
        score: 708,
        air: 23,
        batch: "Class 12 Batch",
      },
      {
        rank: 3,
        name: "Karan Verma",
        score: 705,
        air: 45,
        batch: "Online Batch",
      },
      {
        rank: 4,
        name: "Sneha Iyer",
        score: 702,
        air: 78,
        batch: "NEET 2.0",
      },
      {
        rank: 5,
        name: "Aditya Singh",
        score: 700,
        air: 102,
        batch: "Class 11 Batch",
      },
      {
        rank: 6,
        name: "Priya Nair",
        score: 698,
        air: 134,
        batch: "Class 12 Batch",
      },
      {
        rank: 7,
        name: "Vivaan Kapoor",
        score: 696,
        air: 176,
        batch: "Online Batch",
      },
      {
        rank: 8,
        name: "Ananya Gupta",
        score: 693,
        air: 212,
        batch: "NEET 2.0",
      },
      {
        rank: 9,
        name: "Rohit Malhotra",
        score: 690,
        air: 256,
        batch: "Class 11 Batch",
      },
      {
        rank: 10,
        name: "Meera Joshi",
        score: 687,
        air: 301,
        batch: "Class 12 Batch",
      },
    ],
  },

  2025: {
    title: "NEET 2025 — Top 10 Performers",
    students: [
      {
        rank: 1,
        name: "Devansh Patel",
        score: 710,
        air: 11,
        batch: "Online Batch",
      },
      {
        rank: 2,
        name: "Isha Singh",
        score: 706,
        air: 29,
        batch: "Class 11 Batch",
      },
      {
        rank: 3,
        name: "Arjun Rao",
        score: 703,
        air: 51,
        batch: "Class 12 Batch",
      },
      {
        rank: 4,
        name: "Tanya Bansal",
        score: 700,
        air: 89,
        batch: "NEET 2.0",
      },
      {
        rank: 5,
        name: "Kabir Khan",
        score: 697,
        air: 121,
        batch: "Class 11 Batch",
      },
      {
        rank: 6,
        name: "Nitya Sharma",
        score: 694,
        air: 154,
        batch: "Class 12 Batch",
      },
      {
        rank: 7,
        name: "Manav Jain",
        score: 692,
        air: 182,
        batch: "Online Batch",
      },
      {
        rank: 8,
        name: "Kriti Sinha",
        score: 690,
        air: 214,
        batch: "Class 11 Batch",
      },
      {
        rank: 9,
        name: "Raghav Mehta",
        score: 688,
        air: 251,
        batch: "NEET 2.0",
      },
      {
        rank: 10,
        name: "Simran Arora",
        score: 686,
        air: 289,
        batch: "Class 12 Batch",
      },
    ],
  },

  2024: {
    title: "NEET 2024 — Top 10 Performers",
    students: [
      {
        rank: 1,
        name: "Aditi Verma",
        score: 708,
        air: 15,
        batch: "Class 12 Batch",
      },
      {
        rank: 2,
        name: "Nikhil Gupta",
        score: 705,
        air: 38,
        batch: "Class 11 Batch",
      },
      {
        rank: 3,
        name: "Saanvi Kapoor",
        score: 701,
        air: 62,
        batch: "Online Batch",
      },
      {
        rank: 4,
        name: "Yash Sharma",
        score: 698,
        air: 94,
        batch: "NEET 2.0",
      },
      {
        rank: 5,
        name: "Diya Nair",
        score: 695,
        air: 127,
        batch: "Class 11 Batch",
      },
      {
        rank: 6,
        name: "Kunal Bansal",
        score: 692,
        air: 159,
        batch: "Class 12 Batch",
      },
      {
        rank: 7,
        name: "Rhea Malhotra",
        score: 690,
        air: 194,
        batch: "Online Batch",
      },
      {
        rank: 8,
        name: "Arnav Desai",
        score: 687,
        air: 229,
        batch: "Class 11 Batch",
      },
      {
        rank: 9,
        name: "Isha Reddy",
        score: 684,
        air: 267,
        batch: "NEET 2.0",
      },
      {
        rank: 10,
        name: "Samarth Jain",
        score: 682,
        air: 302,
        batch: "Class 12 Batch",
      },
    ],
  },

  2023: {
    title: "NEET 2023 — Top 10 Performers",
    students: [
      {
        rank: 1,
        name: "Rohan Mehta",
        score: 705,
        air: 19,
        batch: "NEET 2.0",
      },
      {
        rank: 2,
        name: "Ananya Singh",
        score: 702,
        air: 44,
        batch: "Class 12 Batch",
      },
      {
        rank: 3,
        name: "Vihaan Gupta",
        score: 699,
        air: 71,
        batch: "Class 11 Batch",
      },
      {
        rank: 4,
        name: "Pooja Nair",
        score: 696,
        air: 105,
        batch: "Online Batch",
      },
      {
        rank: 5,
        name: "Keshav Sharma",
        score: 693,
        air: 139,
        batch: "Class 11 Batch",
      },
      {
        rank: 6,
        name: "Aarohi Verma",
        score: 690,
        air: 175,
        batch: "Class 12 Batch",
      },
      {
        rank: 7,
        name: "Advait Rao",
        score: 688,
        air: 213,
        batch: "NEET 2.0",
      },
      {
        rank: 8,
        name: "Nisha Bansal",
        score: 685,
        air: 249,
        batch: "Online Batch",
      },
      {
        rank: 9,
        name: "Pranav Jain",
        score: 682,
        air: 284,
        batch: "Class 11 Batch",
      },
      {
        rank: 10,
        name: "Kavya Malhotra",
        score: 680,
        air: 319,
        batch: "Class 12 Batch",
      },
    ],
  },
};

function Results() {
  const [selectedYear, setSelectedYear] = useState("2026");

  const currentResults = resultsByYear[selectedYear];

  return (
    <>
      {/* =========================
          NAVBAR
      ========================== */}
      <header>
        <div className="container navbar">
          <Link className="logo" to="/">
            <div className="logo-mark">M</div>
            MedPath
          </Link>

          <nav className="nav-links">
            <Link to="/">Home</Link>

            <Link to="/centers">Centers</Link>

            <Link to="/batches">Batches</Link>

            <Link className="active" to="/results">
              Results
            </Link>

            <Link to="/student-hub">Student Hub</Link>

            <Link to="/careers">Careers</Link>

            <Link to="/contact">Contact Us</Link>
          </nav>
        </div>
      </header>

      {/* =========================
          HERO
      ========================== */}
      <section className="hero">
        <div className="hexagon hex-1"></div>
        <div className="hexagon hex-2"></div>
        <div className="hexagon hex-3"></div>

        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span></span>
              NEET RESULTS 2026
            </div>

            <h1>
              Top Performers in{" "}
              <span>NEET-UG 2026</span>
            </h1>

            <p>
              Year after year, MedPath students turn their hard work,
              discipline and determination into outstanding results. Here are
              some of our top achievers.
            </p>

            <div className="demo-note">
              ★ Sample data for website demonstration — replace with actual
              results
            </div>
          </div>

          {/* =========================
              PERFORMER SHOWCASE
          ========================== */}
          <div className="performer-showcase">
            <div className="performer-card left">
              <div className="photo-placeholder">
                #UPLOAD PHOTO
              </div>

              <div className="rank">AIR 23</div>

              <h3>Riya Mehta</h3>

              <div className="score">
                708 <span>/ 720</span>
              </div>

              <div className="batch-label">Class 12 Batch</div>
            </div>

            <div className="performer-card main">
              <div className="photo-placeholder">
                #UPLOAD PHOTO
              </div>

              <div className="rank">🏆 AIR 7</div>

              <h3>Aarav Sharma</h3>

              <div className="score">
                712 <span>/ 720</span>
              </div>

              <div className="batch-label">Class 11 Batch</div>
            </div>

            <div className="performer-card right">
              <div className="photo-placeholder">
                #UPLOAD PHOTO
              </div>

              <div className="rank">AIR 45</div>

              <h3>Karan Verma</h3>

              <div className="score">
                705 <span>/ 720</span>
              </div>

              <div className="batch-label">Online Batch</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          STATS
      ========================== */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-box">
            <div className="stat">
              <div className="stat-icon">🏆</div>

              <strong>25+</strong>

              <p>
                Students scoring 700+
                <br />
                NEET 2026
              </p>
            </div>

            <div className="stat">
              <div className="stat-icon">👥</div>

              <strong>120+</strong>

              <p>
                Students scoring 650+
                <br />
                NEET 2026
              </p>
            </div>

            <div className="stat">
              <div className="stat-icon">🎯</div>

              <strong>300+</strong>

              <p>
                Medical selections
                <br />
                Since 2023
              </p>
            </div>

            <div className="stat">
              <div className="stat-icon">🥇</div>

              <strong>4 Years</strong>

              <p>
                Of consistent
                <br />
                performance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          TOP 10 RESULTS
      ========================== */}
      <section className="results-section">
        <div className="container">
          <div className="section-heading center">
            <div className="eyebrow">
              <span></span>
              OUR TRACK RECORD
            </div>

            <h2>
              Top 10 Performers <span>Every Year</span>
            </h2>

            <p>
              A journey of consistent performance, dedication and student
              success.
            </p>
          </div>

          {/* YEAR TABS */}
          <div className="results-tabs">
            {Object.keys(resultsByYear).map((year) => (
              <button
                key={year}
                className={`year-btn ${
                  selectedYear === year ? "active" : ""
                }`}
                onClick={() => setSelectedYear(year)}
              >
                NEET {year}
              </button>
            ))}
          </div>

          {/* RESULT TABLE */}
          <div className="year-content">
            <div className="result-table-wrapper">
              <div className="table-top">
                <h3>{currentResults.title}</h3>

                <span className="table-note">
                  *Sample data for website demonstration
                </span>
              </div>

              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Name</th>
                      <th>Score / 720</th>
                      <th>AIR</th>
                      <th>Batch</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentResults.students.map((student) => (
                      <tr key={`${selectedYear}-${student.rank}`}>
                        <td>{student.rank}</td>

                        <td className="student-name">
                          {student.name}
                        </td>

                        <td className="student-score">
                          {student.score}
                        </td>

                        <td>{student.air}</td>

                        <td>
                          <span className="batch-pill">
                            {student.batch}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          ACHIEVEMENT SECTION
      ========================== */}
      <section className="achievement-section">
        <div className="container achievement-grid">
          <div className="achievement-copy">
            <div className="eyebrow">
              <span></span>
              CONSISTENT EXCELLENCE
            </div>

            <h2>
              Every mark is a step towards the{" "}
              <span>dream.</span>
            </h2>

            <p>
              At MedPath, we believe that exceptional results are built
              through consistent preparation, quality teaching, regular
              assessments and individual attention.
            </p>

            <div className="achievement-points">
              <div className="achievement-point">
                <span>✓</span>
                Concept-focused NEET preparation
              </div>

              <div className="achievement-point">
                <span>✓</span>
                Regular tests and performance analysis
              </div>

              <div className="achievement-point">
                <span>✓</span>
                Personalised academic guidance
              </div>

              <div className="achievement-point">
                <span>✓</span>
                Classroom + online learning support
              </div>
            </div>
          </div>

          <div className="score-board">
            <small>HIGHEST SAMPLE SCORE</small>

            <h3>NEET-UG Performance</h3>

            <div className="score-bar">
              <div className="score-fill"></div>
            </div>

            <div className="score-labels">
              <span>0</span>
              <span>360</span>
              <span>720</span>
            </div>

            <div className="score-highlight">
              <strong>712 / 720</strong>

              <span>Sample NEET 2026 highest score</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          PARENT TESTIMONIALS
      ========================== */}
      <section className="testimonial-section">
        <div className="container">
          <div className="section-heading center">
            <div className="eyebrow">
              <span></span>
              PARENT TESTIMONIALS
            </div>

            <h2>
              What Parents <span>Say About Us</span>
            </h2>

            <p>Because every student's journey matters to us.</p>
          </div>

          <div className="testimonial-grid">
            <div className="testimonial">
              <div className="quote">“</div>

              <p>
                MedPath has been a great support for our son. The teachers are
                approachable, supportive and always willing to guide him
                whenever he needs help.
              </p>

              <div className="parent">
                <div className="parent-photo">
                  #UPLOAD PHOTO
                </div>

                <div>
                  <strong>Mr. Rajesh Sharma</strong>
                  <span>Parent of Aarav Sharma</span>
                </div>
              </div>
            </div>

            <div className="testimonial">
              <div className="quote">“</div>

              <p>
                The structured study material, regular tests and doubt-solving
                sessions helped our daughter become much more confident in her
                preparation.
              </p>

              <div className="parent">
                <div className="parent-photo">
                  #UPLOAD PHOTO
                </div>

                <div>
                  <strong>Mrs. Neha Mehta</strong>
                  <span>Parent of Riya Mehta</span>
                </div>
              </div>
            </div>

            <div className="testimonial">
              <div className="quote">“</div>

              <p>
                We were especially impressed with the consistent academic
                support and the way the faculty tracked our child's
                performance throughout the year.
              </p>

              <div className="parent">
                <div className="parent-photo">
                  #UPLOAD PHOTO
                </div>

                <div>
                  <strong>Mr. Sandeep Verma</strong>
                  <span>Parent of Karan Verma</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          CTA
      ========================== */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-content">
              <h2>Be a part of our success story!</h2>

              <p>
                Start your NEET journey with MedPath and take the next step
                towards your dream medical college.
              </p>
            </div>

            <Link className="cta-button" to="/contact">
              Enquire Now →
            </Link>
          </div>
        </div>
      </section>

      {/* =========================
          FOOTER
      ========================== */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div>
              <Link className="footer-logo" to="/">
                MedPath Academy
              </Link>

              <p className="footer-about">
                Helping aspiring doctors prepare smarter, learn better and move
                closer to their NEET dreams.
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
                  <Link to="/student-hub">Student Hub</Link>
                </li>

                <li>
                  <Link to="/batches">Online Prep</Link>
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

                <li>New Delhi, India</li>
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

export default Results;