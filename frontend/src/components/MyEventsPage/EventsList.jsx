import EventCard from "./EventCard";

function EventsList({ events }) {
  const now = new Date();

  const upcomingEvents = events.filter((event) => {
    const eventDateTime = new Date(event.vrijeme);
    const adjustedDateTime = new Date(eventDateTime);

    adjustedDateTime.setHours(adjustedDateTime.getHours() + 1);

    return adjustedDateTime >= now;
  });

  if (upcomingEvents.length === 0) {
    return <div className="no-events">No upcoming events</div>;
  }

  return (
    <div className="created-events">
      <h2>Created events</h2>
      <div className="events-list">
        {upcomingEvents.map((event) => (
          <EventCard key={event.dogadaj_id} event={event} showButtons={true}/>
        ))}
      </div>
    </div>
  );
}

export default EventsList;
