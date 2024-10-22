import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";

function LoginPage() {
  const navigate = useNavigate();

  const [loginValues, setLoginValues] = useState({
    username: "",
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
      <div className="login-div">
        <h2>Login</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faUser} className="input-icon" />
              <input
                onChange={(e) =>
                  setLoginValues({ ...loginValues, username: e.target.value })
                }
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
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
