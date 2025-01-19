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
  const [isHovered, setIsHovered] = useState(event?.dolazi);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") setIsAdmin(true);

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
  }, [event, events]);

  const handleAttend = async () => {
    try {
      const userEmail = localStorage.getItem("email");
      await axios.post("http://localhost:5000/confirmAttendee", {
        email: userEmail,
        dogadaj_id: event?.dogadaj_id,
      });

      toast.success("Successfully confirmed attendance!");
      getEvents();
    } catch (err) {
      console.error("Error confirming attendee: ", err);
      toast.error("Error confirming attendance! Try again.");
    }
  };

  const handleRemoveAttend = async () => {
    try {
      const userEmail = localStorage.getItem("email");
      await axios.post("http://localhost:5000/removeAttendee", {
        email: userEmail,
        dogadaj_id: event?.dogadaj_id,
      });

      toast("Successfully removed attendance");
      getEvents();
    } catch (err) {
      console.error("Error removing attendee: ", err);
      toast.error("Error removing attendance! Try again.");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(
        `http://localhost:5000/admin/delete-event/${eventId}`,
        config
      );

      toast.success("Event deleted successfully!");
      getEvents();
    } catch (err) {
      console.error("Error deleting event: ", err);
      toast.error("Failed to delete event.");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(
        `http://localhost:5000/admin/delete-user/${userId}`,
        config
      );

      toast.success("User deleted successfully!");
      getEvents();
    } catch (err) {
      console.error("Error deleting user: ", err);
      toast.error("Failed to delete user.");
    }
  };

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
        isAdmin={isAdmin}
        handleDeleteEvent={handleDeleteEvent}
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
                    <div className="upcoming-text">UPCOMING</div>
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
            {isAdmin && (
              <button
                className="delete-user-button"
                onClick={() => handleDeleteUser(event.korisnik_id)}
              >
                Delete User
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
