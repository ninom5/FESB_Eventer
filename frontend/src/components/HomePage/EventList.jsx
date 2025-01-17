import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import eventImage from "../../assets/event.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

function EventList({ events, navigate }) {
  const CustomPrevArrow = ({ className, style, onClick }) => (
    <FontAwesomeIcon
      icon={faChevronLeft}
      className={className}
      style={{
        ...style,
        display: "block",
        right: "-25px",
        zIndex: 10,
        color: "white",
      }}
      color="white"
      onClick={onClick}
    />
  );

  const CustomNextArrow = ({ className, style, onClick }) => (
    <FontAwesomeIcon
      icon={faChevronRight}
      className={className}
      style={{
        ...style,
        display: "block",
        right: "-25px",
        zIndex: 10,
        color: "white",
      }}
      onClick={onClick}
      color="white"
    />
  );

  const settings = {
    autoplay: true,
    autoplaySpeed: 3000,
    dots: true,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  return (
    <div className="events-container">
      <h3>Upcoming events</h3>
      <div className="upcomingEvents-container">
        <Slider {...settings}>
          {events?.map((event, index) => (
            <div
              key={index}
              className="eventCard"
              onClick={() => {
                navigate("/events", { state: event });
                window.scrollTo(0, 0);
              }}
            >
              <div className="event-card-header">
                <img src={eventImage} alt="" />
                <h4>{event.naziv}</h4>
              </div>
              <div className="event-card-details">
                <p>
                  <strong>Description:</strong> {event.opis}
                </p>
                <p>
                  <strong>Time:</strong> {event.vrijeme}
                </p>
                <p>
                  <strong>Organiser:</strong> {event.korisnik}
                </p>
                <p>
                  <strong>Location:</strong> {event.adresa}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default EventList;
