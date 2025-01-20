import profileSectionImage from "../../assets/profileSectionImage.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export function ProfileSection() {
  return (
    <div
      className="home-section-container"
      style={{ padding: "5vh 10vw 5vh 5vw" }}
    >
      <img
        src={profileSectionImage}
        style={{ width: "40vw", height: "auto" }}
        alt=""
      />
      <div className="home-section-container-text">
        <p>{"Explore\nusers\n"}</p>
        <p style={{ fontSize: "1.5em", color: "gray" }}>
          {
            "Become a creator, personalize your account,\nsearch for other users and organisers\n"
          }
        </p>
        <div
          className="home-section-button"
          style={{ backgroundColor: "white" }}
          onClick={() => {
            window.location.href = "/profile";
            window.scrollTo(0, 0);
          }}
        >
          <FontAwesomeIcon icon={faArrowRight} color="black" />
          <p style={{ color: "black" }}>Users</p>
        </div>
      </div>
    </div>
  );
}
