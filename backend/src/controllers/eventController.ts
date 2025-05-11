import { Request, Response } from 'express';
import db from '../models';
const { User, Event } = db;
import { validateEventData } from '../middleware/validateData';

// Update to match both model and API requirements
interface EventAttributes {
  id?: number;
  title: string;
  description: string | null;
  date: Date;
  category: 'Музыкальное мероприятие' | 'Спортивное мероприятие' | 'Искусство' |
    'Бизнес встреча' | 'Семинар' | 'Образовательная встреча' |
    'Деловая встреча' | 'Другое';
  location: string;
  createdBy: number;
}

// API request/response type (uses string for date)
interface EventData extends Omit<EventAttributes, 'date'> {
  date: string; // ISO string format for API
}

interface EventRequest extends Request {
  body: Omit<EventData, 'id'>;
  params: {
    id?: string;
  };
}

// Convert API data to model data
function toEventModel(data: EventData): EventAttributes {
  return {
    ...data,
    date: new Date(data.date) // Convert string to Date
  };
}

// Create
export const createEvent = async (req: EventRequest, res: Response) => {
  try {
    const modelData = toEventModel(req.body);

    const validation = validateEventData(req.body); // Validate the input (string date)
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const { createdBy } = modelData;
    const existingUser = await User.findOne({ where: { id: createdBy } });
    if (!existingUser) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    const newEvent = await Event.create(modelData);
    res.status(201).json({
      ...newEvent.get(),
      date: newEvent.date.toISOString() // Convert back to string for response
    });
  } catch (error: any) {
    res.status(400).json({
      error: 'Error creating event',
      details: error.message
    });
  }
};

// Update event
export const updateEvent = async (req: EventRequest, res: Response) => {
  try {
    const eventId = req.params.id;
    if (!eventId) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    const validation = validateEventData(req.body, true);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const modelData = toEventModel(req.body);
    const [updated] = await Event.update(modelData, {
      where: { id: eventId },
    });

    if (!updated) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const updatedEvent = await Event.findByPk(eventId);
    res.status(200).json({
      ...updatedEvent?.get(),
      date: updatedEvent?.date.toISOString()
    });
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