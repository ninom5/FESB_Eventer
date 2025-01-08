import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

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
    userId: null,
  });

  const [cities, setCities] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem("email");

    axios
      .get(`http://localhost:5000/user?email=${email}`)
      .then((response) => {
        const uId = response.data.id;
        console.log("User ID: ", uId);
        setEventData((prevData) => ({
          ...prevData,
          userId: uId,
        }));
      })
      .catch((error) => {
        console.error("Error fetching user ID: ", error);
      });

    axios
      .get("http://localhost:5000/cities")
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const handleButtonClick = () => {
    setShowForm((prevShowForm) => !prevShowForm);
    setButtonText((prevText) =>
      prevText === "Add event" ? "Cancel" : "Add event"
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/createEvent", eventData)
      .then((response) => {
        alert("Event created successfully!");
        setShowForm(false);
        setButtonText("Add event");
        setEventData({
          eventName: "",
          date: "",
          startTime: "",
          description: "",
          city: "",
          street: "",
          userId: null,
        });
      })
      .catch((error) => {
        console.error("Error creating event: ", error);
        alert("Failed to create event. Please try again.");
      });
  };

  return (
    <div className="eventsPage">
      <Header />
      <h1>Events Page</h1>

      <button className="addEventButton" onClick={handleButtonClick}>
        {buttonText}
      </button>

      {showForm && (
        <form className="newEventForm" onSubmit={handleSubmit}>
          <label>
            Naziv događaja:
            <input
              type="text"
              name="eventName"
              value={eventData.eventName}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Datum:
            <input
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Vrijeme početka:
            <input
              type="time"
              name="startTime"
              value={eventData.startTime}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Opis:
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Grad:
            <select
              name="city"
              value={eventData.city}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city.mjesto_id} value={city.naziv}>
                  {city.naziv}
                </option>
              ))}
            </select>
          </label>
          <label>
            ulica:
            <input
              type="text"
              name="street"
              value={eventData.street}
              onChange={handleInputChange}
              required
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      )}
      <Footer />
    </div>
  );
}

export default EventsPage;
