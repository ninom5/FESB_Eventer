import { Autocomplete } from "@react-google-maps/api";
import axios from "axios";

function EventForm({
  setEventData,
  eventData,
  getEvents,
  handleInputChange,
  setAutocomplete,
  handlePlaceChanged,
  eventLocation,
  setEventLocation,
  showForm,
  setShowForm,
  setButtonText,
  charCount,
  setCharCount,
  mapRef,
}) {
  const maxLength = 1000;

  const handleAutocompleteLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting eventData:", eventData);

    axios
      .post("http://localhost:5000/createEvent", eventData)
      .then((response) => {
        const data = response.data;
        if (data === "Event inserted successfully.") {
          alert(data);

          setShowForm(false);
          setButtonText("Add event");

          setEventData({
            eventName: "",
            date: "",
            startTime: "",
            description: "",
            city: "",
            street: "",
            userId: null,
            charCount: setCharCount(0),
          });

          getEvents();
        } else {
          alert(data);
        }
      })
      .catch((error) => {
        console.error("Error creating event:", error);
        if (error.response && error.response.data) {
          alert(error.response.data);
        } else {
          alert("Failed to create event. Please try again.");
        }
      });
  };

  return (
    <form
      className={`newEventForm ${showForm ? "" : "hidden"}`}
      onSubmit={handleSubmit}
    >
      <label>
        Event name:
        <input
          type="text"
          name="eventName"
          value={eventData.eventName}
          onChange={handleInputChange}
          required
        />
      </label>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <label style={{ width: "45%" }}>
          Date:
          <input
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleInputChange}
            required
          />
        </label>
        <label style={{ width: "45%" }}>
          Time:
          <input
            type="time"
            name="startTime"
            value={eventData.startTime}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>
      <label>
        Location:
        {showForm && (
          <Autocomplete
            onLoad={handleAutocompleteLoad}
            options={{ componentRestrictions: { country: "HR" } }}
            onPlaceChanged={handlePlaceChanged}
          >
            <input
              type="text"
              name="street"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              required
            />
          </Autocomplete>
        )}
      </label>
      <label>
        Description:
        <div className="descriptionContainer">
          <textarea
            id="description"
            name="description"
            value={eventData.description}
            onChange={handleInputChange}
            required
            maxLength={maxLength}
          />
          <div className="charCount">
            {charCount} / {maxLength}
          </div>
        </div>
      </label>
      <button type="submit" style={{ marginTop: "10px" }}>
        Submit
      </button>
    </form>
  );
}

export default EventForm;
