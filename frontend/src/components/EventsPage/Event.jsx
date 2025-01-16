import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faMapMarkerAlt,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toast";
import velvetLogo from "../../assets/velvetLogo.jpg";
import { useNavigate } from "react-router-dom";
import { Details } from "./Details";

export function Event({ event, setEvent, getEvents, events, showForm }) {
  const navigate = useNavigate();
  const [nextEvent, setNextEvent] = useState(null);

  useEffect(() => {
    if (events && event) {
      setIsHovered(event?.dolazi);
      const userEvents = events.filter(
        (e) => e.korisnik_id === event.korisnik_id
      );

      const upcomingEvent = userEvents
        .filter((e) => new Date(e.vrijeme) > new Date(event.vrijeme))
        .sort((a, b) => new Date(a.vrijeme) - new Date(b.vrijeme))[0];
      setNextEvent(upcomingEvent || null);
    }
  }, [event]);

  const handleAttend = async () => {
    try {
      const userEmail = localStorage.getItem("email");
      const resConfirmAttend = await axios.post(
        "http://localhost:5000/confirmAttendee",
        { email: userEmail, dogadaj_id: event?.dogadaj_id }
      );

      toast.success("Succesfully confirmed attendance!");
      getEvents();
    } catch (err) {
      console.log("Error confirming attendee: ", err);
      toast.error("Error confirming attendance! Try again.");
    }
  };

  const handleRemoveAttend = async () => {
    console.log("usa");
    try {
      const userEmail = localStorage.getItem("email");
      const resRemoveAttend = await axios.post(
        "http://localhost:5000/removeAttendee",
        { email: userEmail, dogadaj_id: event?.dogadaj_id }
      );

      toast("Succesfully removed attendance");
      getEvents();
    } catch (err) {
      console.log("Error removing attendee: ", err);
      toast.error("Error removing attendance! Try again.");
    }
  };

  const [isHovered, setIsHovered] = useState(event?.dolazi);

  return (
    <div className={`event-container ${!showForm ? "" : "hidden"}`}>
      <ToastContainer delay={3000} />
      <Details
        event={event}
        setEvent={setEvent}
        handleAttend={handleAttend}
        handleRemoveAttend={handleRemoveAttend}
        events={events}
        isHovered={isHovered}
        setIsHovered={setIsHovered}
      />
      <div className="organiser">
        {event && (
          <>
            <div className="organiser-details">
              <img src={velvetLogo} alt="" />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <p>{event?.korisnik}</p>
                <p style={{ fontSize: "1.1em", color: "gray" }}>
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    style={{ marginRight: "0.5em" }}
                  />
                  {event?.adresa_korisnika}
                </p>
              </div>
            </div>
            {nextEvent && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <div
                  className="upcoming-event"
                  onClick={() => navigate("/events", { state: nextEvent })}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      width: "100%",
                    }}
                  >
                    <div class="upcoming-text">UPCOMING</div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5vh",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1em",
                          color: "white",
                        }}
                      >
                        {nextEvent?.naziv}
                      </p>
                      <p style={{ fontSize: "0.8em", color: "gray" }}>
                        {nextEvent?.vrijeme}
                      </p>
                    </div>
                  </div>
                  <FontAwesomeIcon icon={faChevronDown} color="white" />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
