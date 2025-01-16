import React, { useState } from "react";
import Map from "../Map";
import axios from "axios";

function formatDateTime(timestamp) {
  const dateObj = new Date(timestamp);

  dateObj.setHours(dateObj.getHours() + 1);

  const dateOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
  const dateString = dateObj.toLocaleDateString(undefined, dateOptions);

  const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: false };
  const timeString = dateObj.toLocaleTimeString(undefined, timeOptions);

  return { dateString, timeString };
}

function getCountdownString(timestamp) {
  const now = new Date();
  const originalDateObj = new Date(timestamp);

  originalDateObj.setHours(originalDateObj.getHours() + 1);

  const diffMs = originalDateObj - now;
  const diffSec = Math.floor(diffMs / 1000);

  const days = Math.floor(diffSec / (3600 * 24));
  const hours = Math.floor((diffSec % (3600 * 24)) / 3600);
  const minutes = Math.floor(((diffSec % (3600 * 24)) % 3600) / 60);
  const seconds = ((diffSec % (3600 * 24)) % 3600) % 60;

  let parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  return `Countdown until event: ${parts.join(" ")}.`;
}

function EventCard({ event }) {
  const { naziv, vrijeme, opis, ulica, latitude, longitude, date, organizer } =
    event;

  const [isEditing, setIsEditing] = useState(false);
  const [updatedEvent, setUpdatedEvent] = useState(event);

  const mapRef = React.useRef(null);

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  const isLatLngValid = !isNaN(lat) && !isNaN(lng);

  const { dateString, timeString } = formatDateTime(vrijeme);

  const countdownText = getCountdownString(vrijeme);

  const updateData = async () => {
    try {
      const res = await axios.put("http://localhost:5000/updateEvent", updatedEvent);
      alert("event successfully updated")
    } catch (error) {
      alert("Error updating event: " + error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing((prevState) => !prevState);
  };

  const handleSave = () => {
    setIsEditing(false);
    updateData();
  };
  return (
    <div className="event-card">
    <div className="event-header">
      <h3>{updatedEvent.naziv}</h3>
      {date ? (
        <span className="event-date">{date}</span>
      ) : (
        <span className="event-date">{dateString}</span>
      )}
    </div>

    <div className="event-body">
      <p className="time-text">
        <strong>Time:</strong> {timeString}
      </p>

      <div className="event-description">
        {isEditing ? (
          <textarea
            name="opis"
            value={updatedEvent.opis}
            onChange={handleInputChange}
          />
        ) : (
          <p>{updatedEvent.opis}</p>
        )}
      </div>

      {organizer && (
        <p className="event-organizer">
          <strong>Organizer:</strong>{" "}
          {isEditing ? (
            <input
              type="text"
              name="organizer"
              value={updatedEvent.organizer}
              onChange={handleInputChange}
            />
          ) : (
            updatedEvent.organizer
          )}
        </p>
      )}

      <p className="event-location">
        <strong>Address:</strong>{" "}
        {isEditing ? (
          <input
            type="text"
            name="ulica"
            value={updatedEvent.ulica}
            onChange={handleInputChange}
          />
        ) : (
          updatedEvent.ulica
        )}
      </p>

      <p className="countdown-text">{countdownText}</p>

      {isLatLngValid ? (
        <div className="map-container">
          <Map
            style={{ width: "100%", height: "100%" }}
            center={{ lat, lng }}
            markerPosition={{ lat, lng }}
            showForm={true}
            zoom={15}
            mapRef={mapRef}
          />
        </div>
      ) : (
        <p className="no-coords">No valid coordinates available.</p>
      )}

        <div className="btn-div">
          {isEditing ? (
            <>
              <button className="save-event-btn" onClick={handleSave}>
                Save Changes
              </button>
              <button className="cancel-event-btn" onClick={handleEditClick}>
                Cancel
              </button>
            </>
          ) : (
            <button
              className="edit-event-btn"
              onClick={handleEditClick}
            >
              Edit event
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventCard;
