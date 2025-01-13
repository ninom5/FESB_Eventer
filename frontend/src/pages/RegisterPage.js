import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import HomePage from "../components/HomePage";
import RegisterForm from "../components/RegisterForm/RegisterForm";

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
          alert("Successfully registered");
          navigate("/login");
        }

        if (response.data === "Email already exists")
          alert("Email already exists");

        if (response.data === "Username already exists")
          alert("Username already exists");

        if (response.data === "username contains @")
          alert("Username can't contain @");

        if (response.data === "Passwords do not match")
          alert("Passwords do not match");
      })
      .catch((error) => {
        console.error("Error registering:", error);
      });
  };

  return (
    <div className="register-page">
      <HomePage />
      <div className="register-div">
        <h2>Register</h2>

        <RegisterForm
          onSubmit={handleSubmit}
          onChangeIme={(e) =>
            setRegisterValues({ ...registerValues, ime: e.target.value })
          }
          onChangePrezime={(e) =>
            setRegisterValues({ ...registerValues, prezime: e.target.value })
          }
          onChangeUsername={(e) =>
            setRegisterValues({ ...registerValues, username: e.target.value })
          }
          onChangeEmail={(e) =>
            setRegisterValues({ ...registerValues, email: e.target.value })
          }
          onChangePassword={(e) =>
            setRegisterValues({ ...registerValues, password: e.target.value })
          }
          onChangeConfirmPassword={(e) =>
            setRegisterValues({
              ...registerValues,
              confirmPassword: e.target.value,
            })
          }
        />

        <a className="login-link" href="/login">
          Already have an account? <strong>Login here</strong>
        </a>
      </div>
    </div>
  );
}

export default RegisterPage;
