import React from "react";

function RefreshEventsButton({ handleButtonClick }) {
  return (
    <button className="addEventButton" onClick={handleButtonClick}>
      Refresh events
    </button>
  );
}

export default RefreshEventsButton;
