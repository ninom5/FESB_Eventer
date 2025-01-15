import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import eventImage from "../../assets/event.jpg";

function EventList({ events }) {
  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "red" }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          background: "green",
        }}
        onClick={onClick}
      />
    );
  }

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className="events-container">
      <h3>Upcoming events</h3>
      <br />
      <br />
      <div className="upcomingEvents-container">
        <Slider {...settings}>
          {events?.map((event, index) => (
            <div key={index} className="eventCard">
              <div className="event-card-header">
                <img src={eventImage} alt="" />
                <h4>{event.naziv}</h4>
              </div>
              <div className="event-card-details">
                <br />
                <p>
                  <strong>Description:</strong> {event.opis}
                </p>
                <p>
                  <strong>Time:</strong> {event.vrijeme}
                </p>
                <br />
                <p>
                  <strong>Organiser:</strong> {event.korisnik}
                </p>
                <br />
                <p>
                  <strong>Location:</strong> {event.adresa}
                </p>
                <br />
                <a href="/myEvents">
                  <button className="event-btn">View Details</button>
                </a>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default EventList;
