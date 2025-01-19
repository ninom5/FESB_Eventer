import homeSectionImage from "../../assets/homeSectionImage.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export function EventSection() {
  return (
    <div className="home-section-container">
      <div className="home-section-container-text">
        <p>{"Explore\nevents\n"}</p>
        <p style={{ fontSize: "1.5em", color: "gray" }}>
          {"Search for events nearby, \norganisers and other users\n"}
        </p>
        <div
          className="home-section-button"
          onClick={() => {
            window.location.href = "/events";
            window.scrollTo(0, 0);
          }}
        >
          <FontAwesomeIcon icon={faArrowRight} color="white" />
          <p>Events</p>
        </div>
        <p style={{ marginLeft: "9vw" }}>{"Create\nevents"}</p>
        <p style={{ fontSize: "1.5em", color: "gray", marginLeft: "9vw" }}>
          {"If you're organising an event,\nmake it public using our\nservices"}
        </p>
      </div>
      <img
        src={homeSectionImage}
        style={{ width: "40vw", height: "auto" }}
        alt=""
      />
    </div>
  );
}
