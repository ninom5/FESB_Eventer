import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AddEventButton({ handleButtonClick, buttonText, icon }) {
  return (
    <button className="addEventButton" onClick={handleButtonClick}>
      <FontAwesomeIcon icon={icon} style={{ marginRight: "0.5em" }} />
      {buttonText}
    </button>
  );
}

export default AddEventButton;
