import { useEffect, useState } from 'react';
import EventCard from '../../components/EventCard/EventCard';
import { getEvents } from '../../api/eventService';
import { useAuth } from '../../hooks/useAuth';
import styles from './Events.module.scss';
import type { Event } from '../../types/event';

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents(categoryFilter || undefined);
        setEvents(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchEvents();
  }, [categoryFilter]);

  return (
    <div className={styles.eventsContainer}>
      <h2>Welcome, {user?.name}</h2>
      <div className={styles.filterContainer}>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Music">Music</option>
          <option value="Sports">Sports</option>
        </select>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className={styles.eventsGrid}>
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}