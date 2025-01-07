import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function EventsPage() {
  const [showForm, setShowForm] = useState(false);
  const [buttonText, setButtonText] = useState("Add event");

  const [eventData, setEventData] = useState({
    eventName: "",
    date: "",
    startTime: "",
    description: "",
    city: "",
    street: "",
  });

  const handleButtonClick = () => {
    setShowForm((prevShowForm) => !prevShowForm);
    setButtonText((prevText) =>
      prevText === "Add event" ? "Cancel" : "Add event"
    );
  };

  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetch("/api/cities")
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  return (
    <div className="eventsPage">
      <Header />
      <h1>Events Page</h1>

      <button className="addEventButton" onClick={handleButtonClick}>
        {buttonText}
      </button>

      {showForm && (
        <form className="newEventForm">
          <label>
            Naziv događaja:
            <input type="text" name="eventName" />
          </label>
          <label>
            Datum događaja:
            <input type="date" name="date" />
          </label>

          <label>
            Vrijeme početka:
            <input type="time" name="startTime" />
          </label>

          <label>
            Opis događaja:
            <textarea name="description" />
          </label>

          <label>
            Grad:
            <select name="city">
              {cities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Ulica:
            <textarea name="street" />
          </label>

          <button type="submit">Submit</button>
        </form>
      )}
      <Footer />
    </div>
  );
}

export default EventsPage;
