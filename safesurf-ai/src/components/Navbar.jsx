function Navbar({
  goHome,
  darkMode,
  toggleTheme,
}) {
 
  const handleHome = (event) => {
    event.preventDefault();

    goHome?.();
  };

  const handleServices = (event) => {
    event.preventDefault();

    goHome?.();

    setTimeout(() => {
      document
        .getElementById("services")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 50);
  };

  const handleArticles = (event) => {
    event.preventDefault();
  };

  const handleFAQs = (event) => {
  event.preventDefault();

  goHome?.();

  setTimeout(() => {
    document
      .getElementById("faqs")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }, 50);
};

  const handleContact = (event) => {
    event.preventDefault();
  };

  return (
    <header className="navbar">
      <div className="nav-container">

        <button
          type="button"
          className="logo"
          onClick={goHome}
        >
          <span className="logo-mark">
            ♥
          </span>

          <span>
            SafeSurf AI
          </span>
        </button>

        <nav className="nav-links">

          <a
            href="#home"
            onClick={handleHome}
          >
            Home
          </a>

          <a
            href="#services"
            onClick={handleServices}
          >
            Services
          </a>

          <a
            href="#articles"
            onClick={handleArticles}
          >
            Articles
          </a>

          <a
            href="#faqs"
            onClick={handleFAQs}
          >
            FAQs
          </a>

          <a
            href="#contact"
            onClick={handleContact}
          >
            Contact Us
          </a>

        </nav>


        
<div className="nav-actions">

  

  <button
  type="button"
  className="theme-btn"
  onClick={toggleTheme}
>
  {darkMode ? "☀️" : "🌙"}
</button>

  <button
    type="button"
    className="login-btn"
  >
    Login
  </button>

</div>

      </div>
    </header>
  );
}

export default Navbar;