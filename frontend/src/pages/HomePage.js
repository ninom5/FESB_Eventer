import Header from "../components/Header";
import Footer from "../components/Footer";
import UserList from "../components/HomePage/UserList";
import EventList from "../components/HomePage/EventList";
import { useState, useEffect } from "react";
import axios from "axios";

function HomePage() {
  const [mostActiveUsers, setMostActiveUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(0);
  const [events, setAllEvents] = useState([]);

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
        const eventRes = await axios.get(
          "http://localhost:5000/upComingEvents"
        );
        console.log(eventRes.data);
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
      <UserList
        mostActiveUsers={mostActiveUsers}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      <EventList events={events} />
      <Footer />
    </div>
  );
}
export default HomePage;
