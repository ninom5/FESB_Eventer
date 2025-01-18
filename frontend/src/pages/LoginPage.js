import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import HomePage from "../components/HomePage";
import LoginForm from "../components/LoginForm/LoginForm";

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
          localStorage.setItem("role", response.data.role);
          localStorage.setItem("userId", response.data.userId);
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
      <HomePage />
      <div className="login-div">
        <h2>Login</h2>
        <LoginForm
          onSubmit={handleSubmit}
          onChangeInput={(e) =>
            setLoginValues({ ...loginValues, input: e.target.value })
          }
          onChangePassword={(e) =>
            setLoginValues({ ...loginValues, password: e.target.value })
          }
        />
        <a className="register-link" href="/register">
          Don't have an account? <strong>Register here</strong>
        </a>
      </div>
    </div>
  );
}

export default LoginPage;
