import Header from "../components/Header";
import Footer from "../components/Footer";
import UserList from "../components/HomePage/UserList";
import EventList from "../components/HomePage/EventList";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EventSection } from "../components/HomePage/EventSection";
function HomePage() {
  const [mostActiveUsers, setMostActiveUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(0);
  const [events, setAllEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const email = localStorage.getItem("email");

      try {
        const res = await axios.post("http://localhost:5000/mostActiveUsers", {
          email: email,
        });

        setMostActiveUsers(res.data);
      } catch (err) {
        console.log(err);
      }

      try {
        const eventRes = await axios.post(
          "http://localhost:5000/upComingEvents",
          { email: email }
        );
        setAllEvents(eventRes.data);
      } catch (error) {
        alert("Error: " + error);
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="homePage">
      <Header />
      <EventSection />
      <div className="homeContainer">
        <EventList events={events} navigate={navigate} />
        <UserList
          mostActiveUsers={mostActiveUsers}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </div>
      <Footer />
    </div>
  );
}
export default HomePage;
