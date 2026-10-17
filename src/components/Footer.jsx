import { ArrowRight } from 'lucide-react'

const currentYear = new Date().getFullYear()

function Footer() {
  return (
    <footer className="panel site-footer">
      <div className="footer-main">
        <div className="footer-column footer-brand-column">
          <a className="footer-brand" href="#home" aria-label="C2 Club Converge home">
            <span className="brand-mark">C2</span>
            <span className="brand-text">
              <strong>CLUB</strong>
              <span>CONVERGE</span>
            </span>
          </a>
          <p>A community where ideas, people and possibilities meet.</p>
        </div>

        <nav className="footer-column footer-nav-column" aria-label="Footer quick links">
          <h2>Quick Links</h2>
          <div className="footer-link-list">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#events">Events</a>
            <a href="#gallery">Gallery</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>

        <div className="footer-column footer-connect-column">
          <h2>Connect</h2>
          <p>Social links will appear here once our official channels are configured.</p>
        </div>

        <div className="footer-column footer-newsletter-column">
          <h2>Stay Updated</h2>
          <p>Newsletter signup is not connected yet.</p>
          <form className="footer-newsletter" aria-label="Newsletter signup unavailable">
            <label className="visually-hidden" htmlFor="footer-email">Email address</label>
            <input
              id="footer-email"
              type="email"
              placeholder="Email address"
              disabled
            />
            <button type="submit" aria-label="Newsletter signup unavailable" disabled>
              <ArrowRight aria-hidden="true" size={18} />
            </button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {currentYear} C2 Club Converge</span>
        <div className="footer-legal-links">
          <a href="#contact">Contact</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
