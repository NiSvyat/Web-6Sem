import { Request, Response } from 'express';
import db from '../models';
const { User, Event } = db;
import { validateEventData } from '../middleware/validateData';

// Type definitions
interface EventAttributes {
  id?: number;
  title: string;
  description: string;
  date: string;  // Changed from Date to string to match validation
  location: string;
  createdBy: number;
}

interface EventRequest extends Request {
  body: EventAttributes;
  params: {
    id?: string;
  };
}

// Create
export const createEvent = async (req: EventRequest, res: Response) => {
  // Data validation
  const validation = validateEventData(req.body);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  const { createdBy } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ where: { id: createdBy } });
    if (!existingUser) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    // Create event
    const eventData: EventAttributes = req.body;
    const newEvent = await Event.create(eventData);
    res.status(201).json(newEvent);
  } catch (error: any) {
    res.status(400).json({
      error: 'Error creating event',
      details: error.message
    });
  }
};

// Get all events
export const getEvents = async (_req: Request, res: Response) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (error: any) {
    res.status(400).json({
      error: 'Error fetching events',
      details: error.message
    });
  }
};

// Get event by ID
export const getEventById = async (req: EventRequest, res: Response) => {
  try {
    const eventId = req.params.id;
    if (!eventId) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error: any) {
    res.status(400).json({
      error: 'Error fetching event',
      details: error.message
    });
  }
};

// Update event
export const updateEvent = async (req: EventRequest, res: Response) => {
  // Data validation
  const validation = validateEventData(req.body, true);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  try {
    const eventId = req.params.id;
    if (!eventId) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    const [updated] = await Event.update(req.body, {
      where: { id: eventId },
    });

    if (!updated) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const updatedEvent = await Event.findByPk(eventId);
    res.status(200).json(updatedEvent);
  } catch (error: any) {
    res.status(400).json({
      error: 'Error updating event',
      details: error.message
    });
  }
};

// Delete event
export const deleteEvent = async (req: EventRequest, res: Response) => {
  try {
    const eventId = req.params.id;
    if (!eventId) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    const deleted = await Event.destroy({
      where: { id: eventId },
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({
      error: 'Error deleting event',
      details: error.message
    });
  }
};