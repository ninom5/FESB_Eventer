import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import eventImage from "../../assets/event.jpg";
import velvet from "../../assets/velvet.png";
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
    autoplaySpeed: 4000,
    dots: true,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  const screendWidth = window.innerWidth;

  if (events.length < 5) settings.infinite = false;

  if (screendWidth < 800) settings.slidesToShow = 3;
  else if (screendWidth >= 800 && screendWidth < 1100)
    settings.slidesToShow = 4;
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
                <img src={velvet} alt="" />
                <div>
                  <h4
                    style={{
                      textTransform: "uppercase",
                      color: "white",
                      fontSize: "1.2em",
                    }}
                  >
                    {event.naziv}
                  </h4>
                  <h4 style={{ color: "gray" }}>{event.korisnik}</h4>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default EventList;
