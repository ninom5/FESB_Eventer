import EventCard from "./EventCard";

function EventsList({ events }) {
  return (
    <div className="events-list">
      {events.map((event) => (
        <EventCard key={event.dogadaj_id} event={event} />
      ))}
    </div>
  );
}

export default EventsList;
