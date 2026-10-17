const navItems = ['Home', 'About', 'Events', 'Gallery', 'Contact']

function Navbar() {
  return (
    <header className="topbar">
      <div className="nav-shell">
        <a href="#top" className="brand" aria-label="C2 Club Converge home">
          <span className="brand-mark">C2</span>
          <span className="brand-text">
            <strong>CLUB</strong>
            <span>CONVERGE</span>
          </span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}>
              {item}
            </a>
          ))}
        </nav>

        <a href="#contact" className="primary-button nav-cta">
          Join the Club
        </a>
      </div>
    </header>
  )
}

export default Navbar
