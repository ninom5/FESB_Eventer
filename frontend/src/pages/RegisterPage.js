import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

function RegisterPage() {
  const navigate = useNavigate();

  const [registerValues, setRegisterValues] = useState({
    ime: "",
    prezime: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefon: "",
    mjesto: "",
    ulica: "",
  });

  const handleSubmit = (e) => {
    // Prevent the default form submission
    e.preventDefault();

    // Send a POST request to register endpoint
    axios
      .post("http://localhost:5000/register", registerValues)
      .then((response) => {
        if (response.data === "Successfully registered") {
          navigate("/login");
        }

        if (response.data === "Email already exists") {
          alert("Email already exists");
        }

        if (response.data === "Username already exists") {
          alert("Username already exists");
        }

        if (response.data === "Passwords do not match") {
          alert("Passwords do not match");
        }
      })
      .catch((error) => {
        console.error("Error registering:", error);
      });
  };

  return (
    <div className="register-page">
      <div className="register-div">
        <h2>Register</h2>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faUser} className="input-icon" />
              <input
                onChange={(e) =>
                  setRegisterValues({ ...registerValues, ime: e.target.value })
                }
                type="text"
                id="ime"
                name="ime"
                placeholder="Enter your first name"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faUser} className="input-icon" />
              <input
                onChange={(e) =>
                  setRegisterValues({
                    ...registerValues,
                    prezime: e.target.value,
                  })
                }
                type="text"
                id="prezime"
                name="prezime"
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faUser} className="input-icon" />
              <input
                onChange={(e) =>
                  setRegisterValues({
                    ...registerValues,
                    username: e.target.value,
                  })
                }
                type="text"
                id="username"
                name="username"
                placeholder="Enter a username"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                onChange={(e) =>
                  setRegisterValues({
                    ...registerValues,
                    email: e.target.value,
                  })
                }
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                onChange={(e) =>
                  setRegisterValues({
                    ...registerValues,
                    password: e.target.value,
                  })
                }
                type="password"
                id="password"
                name="password"
                placeholder="Enter a password"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                onChange={(e) =>
                  setRegisterValues({
                    ...registerValues,
                    confirmPassword: e.target.value,
                  })
                }
                type="password"
                id="confirm-password"
                name="confirm-password"
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>

          <button className="register-button" type="submit">
            Register
          </button>
        </form>

        <a className="login-link" href="/login">
          Already have an account? <strong>Login here</strong>
        </a>
      </div>
    </div>
  );
}

export default RegisterPage;
