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
  const [charCount, setCharCount] = useState(0);
  const maxLength = 1000;

  useEffect(() => {
    const email = localStorage.getItem("email");

    // Fetch user data to get userId
    axios
      .get(`http://localhost:5000/user?email=${email}`)
      .then((response) => {
        const userId = response.data.korisnik_id;
        console.log("User ID:", userId);
        setEventData((prevData) => ({
          ...prevData,
          userId: userId,
        }));
      })
      .catch((error) => {
        console.error("Error fetching user ID:", error);
      });

    // Fetch list of cities
    axios
      .get("http://localhost:5000/cities")
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cities:", error);
      });
  }, []);

  const handleButtonClick = () => {
    setShowForm((prev) => !prev);
    setButtonText((prevText) =>
      prevText === "Add event" ? "Cancel" : "Add event"
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "description") setCharCount(value.length);

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
        const data = response.data;
        if (data === "Event inserted successfully") {
          alert(data);
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
        } else {
          alert(data);
        }
      })
      .catch((error) => {
        console.error("Error creating event:", error);
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
            Event name:
            <input
              type="text"
              name="eventName"
              value={eventData.eventName}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Date:
            <input
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Time:
            <input
              type="time"
              name="startTime"
              value={eventData.startTime}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Description:
            <div className="descriptionContainer">
              <textarea
                id="description"
                name="description"
                value={eventData.description}
                onChange={handleInputChange}
                required
                maxLength={maxLength}
              />
              <div className="charCount">
                {" "}
                {charCount} / {maxLength}
              </div>
            </div>
          </label>
          <label>
            City:
            <select
              name="city"
              value={eventData.city}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a city</option>
              {cities.map((c) => (
                <option key={c.mjesto_id} value={c.naziv}>
                  {c.naziv}
                </option>
              ))}
            </select>
          </label>
          <label>
            Street:
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
