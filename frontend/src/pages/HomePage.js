import Header from "../components/Header";
import Footer from "../components/Footer";
import UserList from "../components/HomePage/UserList";
import { useState, useEffect } from "react";
import axios from "axios";

function HomePage() {
  const [mostActiveUsers, setMostActiveUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(0);

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
      <Footer />
    </div>
  );
}
export default HomePage;
