import React from "react";
import Map from "../Map";

function EventCard({ event }) {
  // Destructure additional props if you have them (e.g. organizer, imageUrl, etc.)
  // For demonstration, let's assume you have `date`, `organizer`, and `imageUrl` in your data.
  const {
    naziv,
    vrijeme,
    opis,
    ulica,
    latitude,
    longitude,
    date,
    organizer,
    imageUrl,
  } = event;

  const mapRef = React.useRef(null);

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  const isLatLngValid = !isNaN(lat) && !isNaN(lng);

  return (
    <div className="event-card">
      <div className="event-header">
        <h3>{naziv}</h3>
        {date && <span className="event-date">{date}</span>}
      </div>

      <div className="event-body">
        <p className="time-text">
          <strong>Time:</strong> {vrijeme}
        </p>

        <p className="event-description">{opis}</p>

        {organizer && (
          <p className="event-organizer">
            <strong>Organizer:</strong> {organizer}
          </p>
        )}

        <p className="event-location">
          <strong>Address:</strong> {ulica}
        </p>

        {isLatLngValid ? (
          <div className="map-container">
            <Map
              style={{ width: "100%", height: "100%" }}
              center={{ lat, lng }}
              markerPosition={{ lat, lng }}
              zoom={15}
              mapRef={mapRef}
            />
          </div>
        ) : (
          <p className="no-coords">No valid coordinates available.</p>
        )}
      </div>
    </div>
  );
}

export default EventCard;
