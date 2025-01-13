import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import headerLogo from "../assets/headerLogo.jpg";
import background from "../assets/background.png";

function LoginPage() {
  const navigate = useNavigate();

  const [loginValues, setLoginValues] = useState({
    input: "",
    password: "",
  });

  const handleSubmit = (e) => {
    // Prevent the default form submission
    e.preventDefault();

    // Send a POST request to login endpoint
    axios
      .post("http://localhost:5000/login", loginValues)
      .then((response) => {
        const { accessToken } = response.data;

        if (accessToken) {
          localStorage.setItem("email", response.data.email);
          localStorage.setItem("accessToken", response.data.accessToken);
          navigate("/");
        } else if (response.data === "Invalid username or password") {
          alert("Invalid username or password");
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });
  };

  return (
    <div className="login-page">
      <div className="login-infoLogo">
        <div className="login-info">
          <h2>Welcome to Eventer</h2>
          {/* <h4>
            Looking for a fun way to fulfill your day? <br />
            Register now and start searching for your next day full of
            exicetement!
          </h4> */}
        </div>
        <div className="login-logo">
          <img src={headerLogo} alt="Eventer logo" />
        </div>
      </div>
      <div className="login-div">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faUser} className="input-icon" />
              <input
                onChange={(e) =>
                  setLoginValues({ ...loginValues, input: e.target.value })
                }
                type="text"
                id="input"
                name="input"
                placeholder="Enter your username or email"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                onChange={(e) =>
                  setLoginValues({ ...loginValues, password: e.target.value })
                }
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button className="login-button" type="submit">
            Login
          </button>
        </form>

        <a className="register-link" href="/register">
          Don't have an account? <strong>Register here</strong>
        </a>
      </div>
    </div>
  );
}

export default LoginPage;
