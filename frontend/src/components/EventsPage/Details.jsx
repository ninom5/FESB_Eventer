import { useEffect } from "react";
import velvet from "../../assets/velvet.png";
import {
  faCircleCheck as regularCircleCheck,
  faClock,
} from "@fortawesome/free-regular-svg-icons";
import {
  faCircleCheck as solidCircleCheck,
  faMapMarkerAlt,
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

              <FontAwesomeIcon
                icon={isHovered ? solidCircleCheck : regularCircleCheck}
                size="2x"
                title={
                  event?.dolazi ? "Remove attendance" : "Confrim attendance"
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
              />
            </div>
            <div className="event-desc">
              <div className="event-desc-details">
                <p>{event?.opis}</p>
                <p style={{ width: "100%", height: "auto" }}>
                  No. attendees: {event?.broj_posjetitelja}
                </p>
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
        <p className="upcoming-text" style={{ fontSize: "2em" }}>
          SELECT EVENT TO SEE DETAILS
        </p>
      )}
    </div>
  );
}
