import headerLogo from "../assets/headerLogo.jpg";

function Header() {
  return (
    <header className="homePage-header">
      <div className="header-logo">
        <img src={headerLogo} alt="Eventer logo" />
      </div>
      <nav className="homePage-navigation">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/profile">Profile</a>
          </li>
          <li>
            <a href="/events">Events</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
