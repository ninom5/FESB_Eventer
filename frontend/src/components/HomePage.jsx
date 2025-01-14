import headerLogo from "../assets/headerLogo.jpg";

function HomePage() {
  return (
    <div className="login-infoLogo">
      <div className="login-info">
        <h2>Welcome to Eventer</h2>
      </div>
      <div className="login-logo">
        <img src={headerLogo} alt="Eventer logo" />
      </div>
    </div>
  );
}

export default HomePage;
