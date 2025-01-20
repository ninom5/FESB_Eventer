import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { useState } from "react";
import noUserPicture from "../../assets/noPlayerIcon.svg";
import thompson from "../../assets/thompson.jpg";

function ProfileContainer({
  isEditing,
  updatedData,
  handleInputChange,
  userData,
  cities,
  setUpdatedData,
  handleSave,
  handleCancel,
  handleEdit,
  events,
}) {
  const [autocomplete, setAutocomplete] = useState(null);
  const [userLocation, setUserLocation] = useState("");

  const handleAutocompleteLoad = (autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const handlePlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();

      const addressComponents = place.address_components || [];

      const street = addressComponents.find((component) =>
        component.types.includes("route")
      )?.long_name;

      const streetNumber = addressComponents.find((component) =>
        component.types.includes("street_number")
      )?.long_name;

      const city = addressComponents.find((component) =>
        component.types.includes("locality")
      )?.long_name;

      const fullStreet = (street + " " + streetNumber).trim();

      setUpdatedData((prevState) => ({
        ...prevState,
        mjesto_name: city || "",
        ulica: fullStreet || "",
      }));

      setUserLocation(place.formatted_address || "");
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      libraries={["places"]}
    >
      <div className="profile-page-container">
        <div className="sidebar-container">
          <nav>
            <h3 className="sidebar-container__heading">General</h3>
            <hr style={{ width: "90%", "border-color": "gray" }} />
            <ul className="sidebar-list">
              <li>
                <button
                  onClick={() =>
                    document
                      .getElementById("profile")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    document
                      .getElementById("signIn")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Sign in & security
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    document
                      .getElementById("my-events")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                >
                  My events
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="profile-container">
          <div id="profile" className="profile-data">
            <img src={thompson} alt="Profile" />
            <h3>Your information</h3>
            <div className="information-container">
              <div className="profileField">
                <label>First name </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="ime"
                    value={updatedData.ime || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{userData.ime}</p>
                )}
              </div>

              <div className="profileField">
                <label htmlFor="prezime">Last name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="prezime"
                    value={updatedData.prezime || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{userData.prezime}</p>
                )}
              </div>

              <div className="profileField">
                <label htmlFor="username">Username:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={updatedData.username || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{userData.username}</p>
                )}
              </div>

              <div className="profileField">
                <label htmlFor="telefon">Mobile:</label>
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
                <label htmlFor="mjesto_name">City </label>
                {isEditing ? (
                  <select
                    name="mjesto_name"
                    value={updatedData.mjesto_name || ""}
                    onChange={handleInputChange}
                    style={{ borderRadius: "15px" }}
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
                <label htmlFor="street">Street </label>
                {isEditing ? (
                  <Autocomplete
                    onLoad={handleAutocompleteLoad}
                    onPlaceChanged={handlePlaceChanged}
                  >
                    <input
                      type="text"
                      name="street"
                      value={updatedData.ulica || ""}
                      onChange={(e) => {
                        setUserLocation(e.target.value);
                        setUpdatedData((prevState) => ({
                          ...prevState,
                          ulica: e.target.value,
                        }));
                      }}
                    />
                  </Autocomplete>
                ) : (
                  <p>{userData.ulica || "Not specified"}</p>
                )}
              </div>
            </div>
            <div className="profile-actions">
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
          <div id="signIn" className="signin-container">
            <h3>Sign in</h3>
            <div className="signin-info">
              <div className="profileField">
                <label>E-mail</label>
                <p>{userData.email}</p>
              </div>
              <div className="profileField">
                <label>Status</label>
                <p>{userData.tkorisnika}</p>
              </div>
            </div>
          </div>
          {/* <div className="events-container" id="my-events">
            <h3>Your events</h3>
            <ul></ul>
            {events.map((event) => (
              <li>{event.naziv}</li> //dodat komponentu za listu dogadaja
            ))}
          </div> */}
        </div>
      </div>
    </LoadScript>
  );
}
export default ProfileContainer;
