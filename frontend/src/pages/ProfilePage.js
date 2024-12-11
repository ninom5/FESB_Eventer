import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import noPlayerPicture from "../assets/noPlayerIcon.svg";

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevState) => ({ ...prevState, [name]: value }));
  };

  if (!userData || !cities) return <div>Loading...</div>;

  return (
    <div className="profilePage">
      <Header />
      <div className="profileContainer">
        <div className="profilePicture">
          <img src={noPlayerPicture} alt="Profile" />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const imageUrl = URL.createObjectURL(file);
                  setUpdatedData((prevState) => ({
                    ...prevState,
                    picture_url: imageUrl,
                  }));
                }
              }}
            />
          )}
        </div>
        <div className="profileInfoContainer">
          <div className="profileColumn">
            <div className="profileField">
              <label>Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="ime"
                  value={updatedData.ime || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{userData.ime || "Not specified"}</p>
              )}
            </div>
            <div className="profileField">
              <label>Email:</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  className="disabledField"
                  value={updatedData.email || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{userData.email || "Not specified"}</p>
              )}
            </div>
            <div className="profileField">
              <label>City:</label>
              {isEditing ? (
                <select
                  name="mjesto_name"
                  value={updatedData.mjesto_name || ""}
                  onChange={handleInputChange}
                >
                  <option value="">Select a city (optional)</option>
                  {cities.map((city) => (
                    <option key={city.mjesto_id} value={city.naziv}>
                      {city.naziv}
                    </option>
                  ))}
                </select>
              ) : (
                <p>{userData.mjesto_name || "Not specified"}</p>
              )}
            </div>
            <div className="profileField">
              <label>Street:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="ulica"
                  value={updatedData.ulica || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{userData.ulica || "Not specified"}</p>
              )}
            </div>
          </div>
          <div className="profileColumn">
            <div className="profileField">
              <label>Surname:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="prezime"
                  value={updatedData.prezime || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{userData.prezime || "Not specified"}</p>
              )}
            </div>
            <div className="profileField">
              <label>Username:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={updatedData.username || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{userData.username || "Not specified"}</p>
              )}
            </div>
            <div className="profileField">
              <label>Mobile:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="telefon"
                  value={updatedData.telefon || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{userData.telefon || "Not specified"}</p>
              )}
            </div>
            <div className="profileField">
              <label>Status:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="status_Id"
                  value={updatedData.status_Id || ""}
                  onChange={handleInputChange}
                  className="disabledField"
                />
              ) : (
                <p>{userData.status_Id || "Not specified"}</p>
              )}
            </div>
          </div>
        </div>
        <div className="profileActions">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="saveButton">
                Save Changes
              </button>
              <button onClick={handleCancel} className="cancelButton">
                Cancel
              </button>
            </>
          ) : (
            <button onClick={handleEdit} className="editButton">
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
