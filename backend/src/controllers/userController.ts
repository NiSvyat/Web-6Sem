import { Request, Response } from 'express';
import db from '../models/index.js';
const { User } = db;
import { validateUserData } from '../middleware/validateData.js';

// Update to match your model's attributes
interface UserAttributes {
  id?: number;
  name: string;  // Changed from username to name
  email: string;
  password: string;
}

interface UserRequest extends Request {
  body: Omit<UserAttributes, 'id'>; // Request body shouldn't include id
  params: {
    id?: string;
  };
}

// Create User
export const createUser = async (req: UserRequest, res: Response) => {
  // Data validation
  const validation = await validateUserData(req.body);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  try {
    const userData = {
      ...req.body,
      name: req.body.name
    };

    const existingUser = await User.findOne({
      where: { email: userData.email }
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'User with this email already exists'
      });
    }

    const newUser = await User.create(userData);

    // Solution 1: Type assertion
    const userResponse = newUser.get({ plain: true }) as Omit<UserAttributes, 'password'>;
    res.status(201).json(userResponse);

  } catch (error: any) {
    res.status(400).json({
      error: 'Error creating user',
      details: error.message
    });
  }
};
// Get All Users
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.status(200).json(users);
  } catch (error: any) {
    res.status(400).json({
      error: 'Error fetching users',
      details: error.message
    });
  }
};

// Get User by ID
export const getUserById = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({
      error: 'Error fetching user',
      details: error.message
    });
  }
};

// Update User
export const updateUser = async (req: UserRequest, res: Response) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  // Data validation
  const validation = await validateUserData(req.body, parseInt(userId));  // Convert string to number
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  try {
    const [updated] = await User.update(req.body, {
      where: { id: userId }
    });

    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    res.status(200).json(updatedUser);
  } catch (error: any) {
    res.status(400).json({
      error: 'Error updating user',
      details: error.message
    });
  }
};

// Delete User
export const deleteUser = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const deleted = await User.destroy({
      where: { id: userId },
    });

    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({
      error: 'Error deleting user',
      details: error.message
    });
  }
};