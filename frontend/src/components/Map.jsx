import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { useState } from "react";
import '../styles/map.css';

const libraries = ["marker", "places"];

function Map({ style, mapRef, center, setCenter, markerPosition, showForm, events, zoom, setZoom }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <GoogleMap
        mapContainerStyle={style}
        ref={mapRef}
        onLoad={(map) => (mapRef.current = map)}
        center={center}
        zoom={zoom}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          mapId: "2dccd7b6ea472154",
        }}
        onClick={() =>  setSelectedEvent(null)}
      >
        {showForm ? markerPosition && <Marker position={markerPosition}/> : events?.map(event => <Marker position={{lng: parseFloat(event.longitude), lat: parseFloat(event.latitude)}} icon={{path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: "#228B22",
          fillOpacity: 1,
          scale: 8,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,}} onClick={() => { setSelectedEvent(event); setCenter({lng: parseFloat(event.longitude), lat: parseFloat(event.latitude)}); setZoom(15)}}/>)}
        {selectedEvent && (
          <InfoWindow
            position={{ lat: parseFloat(selectedEvent.latitude), lng: parseFloat(selectedEvent.longitude) }}
            onCloseClick={() => setSelectedEvent(null)}
          >
            <div>
              <strong style={{fontSize: '1.4em'}}>{selectedEvent.naziv}</strong>
              <p style={{color: 'rgba(0, 0, 0, 0.54)', fontSize: '1em', marginBottom: '1vh'}}>{selectedEvent.vrijeme}</p>
              <div className="event-adress">{selectedEvent.adresa}</div>
              <div className="event-url"><a href="/myEvents" target="_blank">See more details</a></div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}

export default Map;
