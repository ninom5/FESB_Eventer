import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Map from "../components/Map";
import axios from "axios";
import { Autocomplete } from "@react-google-maps/api";

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

  const [charCount, setCharCount] = useState(0);
  const maxLength = 1000;

  useEffect(() => {
    const email = localStorage.getItem("email");

    // Fetch user data to get userId
    axios
      .get(`http://localhost:5000/user?email=${email}`)
      .then((response) => {
        const userId = response.data.korisnik_id;
        setEventData((prevData) => ({
          ...prevData,
          userId: userId,
        }));
      })
      .catch((error) => {
        console.error("Error fetching user ID:", error);
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
    console.log("Submitting eventData:", eventData); // <-- Add this

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

        if (error.response && error.response.data) {
          alert(error.response.data);
        } else {
          alert("Failed to create event. Please try again.");
        }
      });
  };

  const [autocomplete, setAutocomplete] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [zoom, setZoom] = useState(10);
  const [center, setCenter] = useState({ lat: 43.508133, lng: 16.440193 });
  const [eventLocation, setEventLocation] = useState("");
  const mapRef = useRef(null);

  const handleAutocompleteLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const handlePlaceChanged = () => {
    if (!autocomplete) return;

    const place = autocomplete.getPlace();
    if (!place || !place.address_components || !place.geometry) {
      alert("Odabrano mjesto nema geometrijsku lokaciju ili nedostaju podaci.");
      return;
    }

    const location = place.geometry.location;

    setCenter({
      lat: location.lat(),
      lng: location.lng(),
    });

    setZoom(15);

    const addressComponents = place.address_components;
    let streetNumber = "";
    let route = "";
    let postalCode = "";
    let city = "";
    let country = "";

    addressComponents.forEach((comp) => {
      if (comp.types.includes("street_number")) streetNumber = comp.long_name;

      if (comp.types.includes("route") || comp.types.includes("square"))
        route = comp.long_name;

      if (comp.types.includes("locality")) city = comp.long_name;

      if (comp.types.includes("administrative_area_level_1") && !city)
        city = comp.long_name;

      if (comp.types.includes("postal_code")) postalCode = comp.long_name;

      if (comp.types.includes("country")) country = comp.long_name;
    });

    const fullStreet = (route + " " + streetNumber).trim();

    handleInputChange({ target: { name: "city", value: city } });
    handleInputChange({ target: { name: "street", value: fullStreet } });

    setEventLocation(place.formatted_address || "");

    const marker = new window.google.maps.marker.AdvancedMarkerElement({
      map: mapRef.current,
      position: {
        lat: location.lat(),
        lng: location.lng(),
      },
    });
    marker.addListener("click", () => {
      // alert("Advanced Marker Clicked!");
    });
  };

  return (
    <div className="eventsPage">
      <Header />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "80vw",
        }}
      >
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
              Location:
              <Autocomplete
                onLoad={handleAutocompleteLoad}
                options={{ componentRestrictions: { country: "HR" } }}
                onPlaceChanged={handlePlaceChanged}
              >
                <input
                  type="text"
                  name="street"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  required
                />
              </Autocomplete>
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
            <button type="submit" style={{ marginTop: "10px" }}>
              Submit
            </button>
          </form>
        )}
        <Map
          style={{
            width: showForm ? "60%" : "100%",
            height: "70vh",
            transition: "width 1s ease",
          }}
          markerPosition={markerPosition}
          mapRef={mapRef}
          center={center}
          zoom={zoom}
        />
      </div>
      <button className="addEventButton" onClick={handleButtonClick}>
        {buttonText}
      </button>
      <Footer />
    </div>
  );
}

export default EventsPage;
