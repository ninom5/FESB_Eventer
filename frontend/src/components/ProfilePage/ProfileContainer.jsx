import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { useState } from "react";

function ProfileContainer({
  isEditing,
  updatedData,
  handleInputChange,
  userData,
  cities,
  setUpdatedData,
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
    </LoadScript>
  );
}
export default ProfileContainer;
