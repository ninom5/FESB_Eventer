import { useEffect, useState } from "react";
import "../styles/map.css";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";

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
  const [marker, setMarker] = useState(null);
  const [selectedEventMap, setSelectedEventMap] = useState(null);

  useEffect(() => {
    if (events) setMapEvents(events);
  }, [events]);

  useEffect(() => {
    if (selectedEvent) setSelectedEventMap(selectedEvent);
    else setSelectedEventMap(null);
  }, [selectedEvent]);

  useEffect(() => {
    if (markerPosition) setMarker(markerPosition);
  }, [markerPosition]);

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
      onClick={() => {
        if (selectedEvent !== undefined) setSelectedEvent(null);
        setSelectedEventMap(null);
      }}
    >
      {showForm
        ? marker && <Marker position={marker} />
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
      {selectedEventMap && (
        <InfoWindow
          position={{
            lat: parseFloat(selectedEventMap.latitude),
            lng: parseFloat(selectedEventMap.longitude),
          }}
          onCloseClick={() => {
            setSelectedEvent(null);
            setSelectedEventMap(null);
          }}
        >
          <div>
            <strong style={{ fontSize: "1.4em" }}>
              {selectedEventMap?.naziv}
            </strong>
            <p
              style={{
                color: "rgba(0, 0, 0, 0.54)",
                fontSize: "1em",
                marginBottom: "1vh",
              }}
            >
              {selectedEventMap?.vrijeme}
            </p>
            <div className="event-adress">{selectedEventMap?.adresa}</div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

export default Map;
