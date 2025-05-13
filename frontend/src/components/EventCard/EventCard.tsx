import type { Event } from '../../types/event.ts'; 
interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <span>Category: {event.category}</span>
    </div>
  );
}