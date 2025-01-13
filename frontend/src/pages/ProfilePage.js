import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import ProfileActions from "../components/ProfilePage/ProfileActions";
import ProfileContainer from "../components/ProfilePage/ProfileContainer";
import ProfilePicture from "../components/ProfilePage/ProfilePicture";

function ProfilePage() {
  const [userData, setUserData] = useState({
    ime: "",
    prezime: "",
    username: "",
    email: "",
    telefon: "",
    status_Id: "",
    mjesto_name: "",
    ulica: "",
    picture_url: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [cities, setCities] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevState) => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    const email = localStorage.getItem("email");

    axios
      .get(`http://localhost:5000/user?email=${email}`)
      .then((response) => {
        const fetchedData = response.data;
        setUserData(fetchedData);
        setUpdatedData(fetchedData);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });

    axios
      .get("http://localhost:5000/cities")
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cities:", error);
      });
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdatedData(userData);
  };

  const handleSave = () => {
    if (
      updatedData.ime === "" ||
      updatedData.prezime === "" ||
      updatedData.username === ""
    ) {
      alert("Name, Surname and Username fields are required!");
      return;
    }

    axios
      .put("http://localhost:5000/userUpdate", updatedData)
      .then(() => {
        setUserData(updatedData);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error saving user data:", error);
      });
  };

  if (!userData || !cities) return <div>Loading...</div>;

  return (
    <div className="profilePage">
      <Header />
      <div className="profileContainer">
        <ProfilePicture />
        <ProfileContainer
          isEditing={isEditing}
          updatedData={updatedData}
          handleInputChange={handleInputChange}
          userData={userData}
          cities={cities}
          setUpdatedData={setUpdatedData}
        />
        <ProfileActions
          handleSave={handleSave}
          handleCancel={handleCancel}
          handleEdit={handleEdit}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
}

export default ProfilePage;
