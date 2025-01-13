import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function InputWithIcon({
  icon,
  type,
  id,
  name,
  placeholder,
  onChange,
  required,
}) {
  return (
    <div className="input-group">
      <div className="input-with-icon">
        <FontAwesomeIcon icon={icon} className="input-icon" />
        <input
          onChange={onChange}
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
        />
      </div>
    </div>
  );
}

export default InputWithIcon;
