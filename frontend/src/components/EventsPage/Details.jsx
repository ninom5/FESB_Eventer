import { useEffect } from "react";
import velvet from "../../assets/velvet.png";
import {
  faCircleCheck as regularCircleCheck,
  faClock,
} from "@fortawesome/free-regular-svg-icons";
import {
  faCircleCheck as solidCircleCheck,
  faMapMarkerAlt,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Details({
  event,
  setEvent,
  handleAttend,
  handleRemoveAttend,
  events,
  isHovered,
  setIsHovered,
  isAdmin,
  handleDeleteEvent,
}) {
  useEffect(() => {
    if (event && events)
      setEvent(events.find((item) => item.dogadaj_id == event.dogadaj_id));
  }, [events]);

  return (
    <div className="event">
      {event ? (
        <>
          <img src={velvet} alt="" />
          <div className="event-details">
            <div className="event-title">
              <p>{event?.naziv}</p>

              {
                (event.status === "Uskoro" || event.status === "U tijeku") ? (<FontAwesomeIcon
                  icon={isHovered ? solidCircleCheck : regularCircleCheck}
                  size="2x"
                  title={
                    event?.dolazi ? "Remove attendance" : "Confirm attendance"
                  }
                  color="white"
                  style={{
                    alignSelf: "end",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setIsHovered((prev) => !prev)}
                  onMouseLeave={() => setIsHovered((prev) => !prev)}
                  onClick={() =>
                    event?.dolazi ? handleRemoveAttend() : handleAttend()
                  }
                />) : (<FontAwesomeIcon
                  icon={solidCircleCheck}
                  size="2x"/>
                )
              }
              
            </div>
            <div className="event-desc">
              <div className="event-desc-details">
                <p>{event?.opis}</p>
              </div>
              <div className="event-desc-footer">
                <p>No. attendees: {event?.broj_posjetitelja}</p>
                {isAdmin && (
                  <div
                    className="delete-event-button"
                    onClick={() => handleDeleteEvent(event.dogadaj_id)}
                  >
                    Delete Event
                    <FontAwesomeIcon icon={faTrashCan} color="white" />
                  </div>
                )}
              </div>
            </div>
            <div className="event-footer">
              <p>
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  style={{ marginRight: "0.5em" }}
                />
                {event?.adresa}
              </p>
              <p>
                <FontAwesomeIcon
                  icon={faClock}
                  style={{ marginRight: "0.5em" }}
                />
                {event?.vrijeme}
              </p>
              <div
                className="event-status"
                style={{
                  backgroundColor:
                    event?.status == "Uskoro"
                      ? "darkgreen"
                      : event?.status == "U tijeku"
                      ? "green"
                      : event?.status == "Otkazano"
                      ? "red"
                      : "gray",
                }}
              >
                <p>
                  {event?.status == "Uskoro"
                    ? "Upcoming"
                    : event?.status == "U tijeku"
                    ? "In progress"
                    : event?.status == "Otkazano"
                    ? "Canceled"
                    : "On hold"}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="upcoming-text" style={{ fontSize: "3em" }}>
          SELECT EVENT TO SEE DETAILS
        </p>
      )}
    </div>
  );
}
