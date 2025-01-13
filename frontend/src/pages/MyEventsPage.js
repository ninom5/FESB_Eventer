import Header from "../components/Header";
import EventsList from "../components/MyEventsPage/EventsList";
import Footer from "../components/Footer";
import axios from "axios";
import { useEffect, useState } from "react";

function MyEvents() {
  const [events, setEvents] = useState([]);
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

  if (!events) return <div>Loading...</div>;

  return (
    <div className="myEventsPage">
      <Header />

      <EventsList events={events} />

      <Footer />
    </div>
  );
}

export default MyEvents;
