import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

function Map() {
  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ height: "70vh", width: "70%" }}
        center={{ lat: 43.508133, lng: 16.440193 }}
        zoom={10}
      ></GoogleMap>
    </LoadScript>
  );
}

export default Map;
