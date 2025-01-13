import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import InputWithIcon from "../InputWithIcon";

function LoginForm({ onSubmit, onChangeInput, onChangePassword }) {
  return (
    <form onSubmit={onSubmit} className="login-form">
      <InputWithIcon
        icon={faUser}
        type="text"
        id="input"
        name="input"
        placeholder="Enter your username or email"
        onChange={onChangeInput}
        required
      />

      <InputWithIcon
        icon={faLock}
        type="password"
        id="password"
        name="password"
        placeholder="Enter your password"
        onChange={onChangePassword}
        required
      />

      <button className="login-button" type="submit">
        Login
      </button>
    </form>
  );
}

export default LoginForm;
