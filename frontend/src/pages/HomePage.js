import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import noPlayerPicture from "../assets/noPlayerIcon.svg";
import axios from 'axios';

function HomePage() {

  const [mostActiveUsers, setMostActiveUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(0);

  useEffect(()=>{
    const fetchData = async() => {
      const email = localStorage.getItem('email');

      try{
        const res = await axios.post('http://localhost:5000/mostActiveUsers', {email: email});

        setMostActiveUsers(res.data);
      }catch(err){
        console.log(err);
      }
    }
    fetchData();
  }, [])
  
  return (
    <div className="homePage">
      <Header />
      <div className="homeContainer">
        <h3>Most active users</h3>
        <div className="homeUsers" >
          {mostActiveUsers?.map((item, index) => {
            return (
            <div key={index} className={`homeUserCard${selectedUser === index ? " selected" : ""}`} 
                 onMouseEnter={() => setSelectedUser(index)}
            >
              <div className="homeUserCardProfile">
                  <img src={item.picture_url}/>
                <div className="homeUserCardProfileText">
                  <p>{item.ime} {item.prezime}</p>
                  <p>{item.email}</p>
                  <p>{item.tkorisnika === 'Korisnik' ? 'User' : 'Organiser'}</p>
                </div>
              </div>
              <div className="homeUserCardData">
                <div>
                  <p>{item.tkorisnika === 'Korisnik' ? 'Next attending event: ' : 'Upcoming event: '}{item.sljedeci}</p>
                  <p>{item.tkorisnika === 'Korisnik' ? 'No. attended events: ' : 'No. organised events: '}{item.brojdogadaja}</p>
                </div>
                <button>See more</button>
              </div>
            </div>
            ) 
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default HomePage;