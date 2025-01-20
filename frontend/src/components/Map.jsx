import { useEffect, useState } from "react";
import "../styles/map.css";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import Loader from "../components/Loader";

function Map({
  style,
  mapRef,
  center,
  setCenter,
  markerPosition,
  showForm,
  events,
  zoom,
  setZoom,
  selectedEvent,
  setSelectedEvent,
}) {
  const [mapEvents, setMapEvents] = useState(null);

  useEffect(() => {
    if (events) setMapEvents(events);
  }, [events]);

  return (
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
      onClick={() => setSelectedEvent(null)}
    >
      {showForm
        ? markerPosition && <Marker position={markerPosition} />
        : mapEvents?.map((event, index) => (
            <Marker
              key={index}
              position={{
                lng: parseFloat(event.longitude),
                lat: parseFloat(event.latitude),
              }}
              icon={{
                path: window?.google?.maps?.SymbolPath?.CIRCLE,
                fillColor: "#228B22",
                fillOpacity: 1,
                scale: 8,
                strokeColor: "#FFFFFF",
                strokeWeight: 2,
              }}
              onClick={() => {
                setSelectedEvent(event);
                setCenter({
                  lng: parseFloat(event.longitude),
                  lat: parseFloat(event.latitude),
                });
                setZoom(15);
              }}
            />
          ))}
      {selectedEvent && (
        <InfoWindow
          position={{
            lat: parseFloat(selectedEvent?.latitude),
            lng: parseFloat(selectedEvent?.longitude),
          }}
          onCloseClick={() => setSelectedEvent(null)}
        >
          <div>
            <strong style={{ fontSize: "1.4em" }}>
              {selectedEvent?.naziv}
            </strong>
            <p
              style={{
                color: "rgba(0, 0, 0, 0.54)",
                fontSize: "1em",
                marginBottom: "1vh",
              }}
            >
              {selectedEvent?.vrijeme}
            </p>
            <div className="event-adress">{selectedEvent?.adresa}</div>
            <div className="event-url">
              <a href="/myEvents" target="_blank">
                See more details
              </a>
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

export default Map;
