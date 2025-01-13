import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import InputWithIcon from "../InputWithIcon";

function RegisterForm({
  onSubmit,
  onChangeIme,
  onChangePrezime,
  onChangeUsername,
  onChangeEmail,
  onChangePassword,
  onChangeConfirmPassword,
}) {
  return (
    <form onSubmit={onSubmit} className="register-form">
      <InputWithIcon
        icon={faUser}
        type="text"
        id="ime"
        name="ime"
        placeholder="Enter your first name"
        onChange={onChangeIme}
        required
      />

      <InputWithIcon
        icon={faUser}
        type="text"
        id="prezime"
        name="prezime"
        placeholder="Enter your last name"
        onChange={onChangePrezime}
        required
      />

      <InputWithIcon
        icon={faUser}
        type="text"
        id="username"
        name="username"
        placeholder="Enter a username"
        onChange={onChangeUsername}
        required
      />

      <InputWithIcon
        icon={faEnvelope}
        type="email"
        id="email"
        name="email"
        placeholder="Enter your email"
        onChange={onChangeEmail}
        required
      />

      <InputWithIcon
        icon={faLock}
        type="password"
        id="password"
        name="password"
        placeholder="Enter a password"
        onChange={onChangePassword}
        required
      />

      <InputWithIcon
        icon={faLock}
        type="password"
        id="confirm-password"
        name="confirm-password"
        placeholder="Confirm your password"
        onChange={onChangeConfirmPassword}
        required
      />

      <button className="register-button" type="submit">
        Register
      </button>
    </form>
  );
}

export default RegisterForm;
