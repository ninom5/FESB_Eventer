import { GoogleMap, LoadScript } from "@react-google-maps/api";

const libraries = ["marker", "places"];

function Map({style, mapRef, center, zoom}) {
  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <GoogleMap
        mapContainerStyle={style}
        ref={mapRef}
        onLoad={(map) => mapRef.current = map}
        center={center}
        options={{streetViewControl: false, mapTypeControl: false, mapId: "2dccd7b6ea472154"}}
        zoom={zoom}
      >
      </GoogleMap>
    </LoadScript>
  );
}

export default Map;
