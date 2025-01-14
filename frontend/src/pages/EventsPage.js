import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Map from "../components/Map";
import axios from "axios";
import EventForm from "../components/EventsPage/EventForm";
import AddEventButton from "../components/EventsPage/AddEventButton";
import SeeMyEventsButton from "../components/EventsPage/SeeMyEventsButton";
import RefreshEventsButton from "../components/EventsPage/RefreshEvents";

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
    latitude: null,
    longitude: null,
  });
  const [events, setEvents] = useState([]);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
    getEvents();
    }, 10);


    const email = localStorage.getItem("email");
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

    return () => clearInterval(interval);
  }, []);

  const getEvents = async() => {
    try {
      const resEvents = await axios.get('http://localhost:5000/allEvents');

      setEvents(resEvents.data);

    } catch(err) {
      console.log(err);
    }
  }

  const handleButtonClick = () => {
    setShowForm((prev) => !prev);
    setButtonText((prevText) =>
      prevText === "Add event" ? "Cancel" : "Add event"
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "description") {
      setCharCount(value.length);
    }
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [autocomplete, setAutocomplete] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [zoom, setZoom] = useState(10);
  const [center, setCenter] = useState({ lat: 43.508133, lng: 16.440193 });
  const [eventLocation, setEventLocation] = useState("");
  const mapRef = useRef(null);

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

    setEventData((prevData) => ({
      ...prevData,
      latitude: location.lat(),
      longitude: location.lng(),
    }));

    setMarkerPosition({
      lat: location.lat(),
      lng: location.lng(),
    });

    let streetNumber = "";
    let route = "";
    let city = "";
    let postalCode = "";
    let country = "";

    place.address_components.forEach((comp) => {
      if (comp.types.includes("street_number")) {
        streetNumber = comp.long_name;
      }
      if (comp.types.includes("route") || comp.types.includes("square")) {
        route = comp.long_name;
      }
      if (comp.types.includes("locality")) {
        city = comp.long_name;
      }
      if (comp.types.includes("administrative_area_level_1") && !city) {
        city = comp.long_name;
      }
      if (comp.types.includes("postal_code")) {
        postalCode = comp.long_name;
      }
      if (comp.types.includes("country")) {
        country = comp.long_name;
      }
    });

    const fullStreet = (route + " " + streetNumber).trim();

    handleInputChange({ target: { name: "city", value: city } });
    handleInputChange({ target: { name: "street", value: fullStreet } });

    setEventLocation(place.formatted_address || "");
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
          <EventForm
            setEventData={setEventData}
            eventData={eventData}
            getEvents={getEvents}
            handleInputChange={handleInputChange}
            setAutocomplete={setAutocomplete}
            handlePlaceChanged={handlePlaceChanged}
            eventLocation={eventLocation}
            setEventLocation={setEventLocation}
            charCount={charCount}
            setShowForm={setShowForm}
            setButtonText={setButtonText}
            setCharCount={setCharCount}
          />
        )}
        <Map
          style={{
            width: showForm ? "60%" : "100%",
            height: "70vh",
            transition: "width 1s ease",
            marginTop: "20px",
          }}
          markerPosition={markerPosition}
          mapRef={mapRef}
          center={center}
          setCenter={setCenter}
          events={events}
          showForm={showForm}
          zoom={zoom}
          setZoom={setZoom}
        />
      </div>
      <div className="eventsPage-buttons">
        <AddEventButton
          handleButtonClick={handleButtonClick}
          buttonText={buttonText}
        />
        <SeeMyEventsButton />
        <RefreshEventsButton handleButtonClick={getEvents}/>
      </div>
      <Footer />
    </div>
  );
}

export default EventsPage;
