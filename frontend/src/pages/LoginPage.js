import "../styles/loginPage.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";

function LoginPage() {
  const navigate = useNavigate();

  const [registerValues, setRegisterValues] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterValues({ ...registerValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        registerValues
      );
      if (response.data === "Successfully logged in") {
        navigate("/home");
      } else if (response.data === "Server error") alert("server error");
      else if (response.data === "Wrong email or password")
        alert("wrong email or password");
      else {
        console.error("Login failed");
      }
    } catch (err) {
      console.error("Error during login:", err);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <div className="login">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FontAwesomeIcon icon={faUser} />
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={registerValues.email}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <FontAwesomeIcon icon={faLock} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={registerValues.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
