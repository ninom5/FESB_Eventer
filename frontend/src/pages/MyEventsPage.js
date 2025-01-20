import Header from "../components/Header";
import EventsList from "../components/MyEventsPage/EventsList";
import Footer from "../components/Footer";
import axios from "axios";
import { useEffect, useState } from "react";
import ConfirmedEvents from "../components/MyEventsPage/ConfirmedEventsList";

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [confirmedEvents, setConfirmedEvents] = useState([]);
  const [filteredConfirmedEvents, setFilteredConfirmedEvents] = useState([]);
  const [userId, setUserId] = useState(0);

  useEffect(() => {
    const email = localStorage.getItem("email");

    axios
      .get(`http://localhost:5000/user?email=${email}`)
      .then((response) => {
        const fetchedData = response.data;
        setUserId(fetchedData.korisnik_id);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/events?korisnik_id=${userId}`)
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [userId]);

  useEffect(() => {
    const userConfirmedComing = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000//userConfirmedEvents?korisnik_id=${userId}`
        );

        setConfirmedEvents(response.data);
      } catch (error) {
        console.error("error getting data: " + error);
      }
    };

    userConfirmedComing();
  }, [userId]);

  useEffect(() => {
    const fetchConfirmedEvents = async () => {
      try {
        const event = confirmedEvents.map((confirmedEvent) =>
          axios.get(
            `http://localhost:5000//getEventById?dogadaj_id=${confirmedEvent.dogadaj_id}`
          )
        );

        const eventResponse = await Promise.all(event);
        const eventDetails = eventResponse.map((response) => response.data);

        setFilteredConfirmedEvents(eventDetails);
        console.log("aaaaa: " + eventDetails); //ne radidiadiid
      } catch (error) {
        console.error("Error filtered confirmed events:" + error);
      }

      fetchConfirmedEvents();
    };
  }, [confirmedEvents]);

  if (!events) return <div>Loading...</div>;

  return (
    <div className="myEventsPage">
      <Header />

      <EventsList events={events} />
      {/* <ConfirmedEvents events={filteredConfirmedEvents} /> */}

      <Footer />
    </div>
  );
}

export default MyEvents;
