import { Link } from "react-router-dom";
import "./thankyou.css";

function ThankYou() {
  return (
    <div className="thank-you-page">
      <div className="thank-you-card">

        <div className="thank-you-icon">
          ✓
        </div>

        <h1>Thank You!</h1>

        <p className="thank-you-main">
          Your message has been submitted successfully.
        </p>

        <p className="thank-you-sub">
          Thank you for contacting MedLife Academy. Our team will get
          back to you shortly.
        </p>

        <div className="thank-you-actions">
          <Link to="/" className="thank-you-btn primary">
            Back to Home
          </Link>

          <Link to="/batches" className="thank-you-btn secondary">
            Explore Batches
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ThankYou;