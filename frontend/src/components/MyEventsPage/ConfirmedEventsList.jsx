import EventCard from "./EventCard";

function ConfirmedEvents({ events }) {
  return (
    <div className="confirmed-events-list">
      {events.map((event) => (
        <EventCard key={event.dogadaj_id} event={event} />
      ))}
    </div>
  );
}

export default ConfirmedEvents;
