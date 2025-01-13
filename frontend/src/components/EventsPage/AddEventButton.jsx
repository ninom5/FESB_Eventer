import React from "react";

function AddEventButton({ handleButtonClick, buttonText }) {
  return (
    <button className="addEventButton" onClick={handleButtonClick}>
      {buttonText}
    </button>
  );
}

export default AddEventButton;
