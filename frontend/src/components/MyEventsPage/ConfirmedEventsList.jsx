import EventCard from "./EventCard";

function ConfirmedEvents({ events }) {
  return (
    <div className="confirmed-events">
     <h2> Events you are coming to</h2>
      <div className="confirmed-events-list">
        {events.map((event) => {
          console.log(event.dogadaj_id);
          return <EventCard key={event.dogadaj_id} event={event} showButtons={false}/>;
        })}
      </div>
    </div>
  );
}

export default ConfirmedEvents;
