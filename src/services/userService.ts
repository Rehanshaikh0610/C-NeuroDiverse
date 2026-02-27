import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import UserProgress from '@/models/UserProgress';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function registerUser(name: string, email: string, password: string) {
  try {
    await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already in use');
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password, // Will be hashed by the pre-save hook in the User model
      level: 1,
      points: 10,
      streakDays: 1
    });
    
    // Create user progress record
    await UserProgress.create({
      userId: user._id,
      activities: [{
        type: 'login',
        points: 10,
        details: 'Initial registration',
      }],
    });
    
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      level: user.level,
      points: user.points,
      streakDays: user.streakDays
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function loginUser(email: string, password: string) {
  try {
    await connectToDatabase();
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    
    // Update last login time
    user.lastLogin = new Date();
    await user.save();
    
    // Update user progress for login activity
    let userProgress = await UserProgress.findOne({ userId: user._id });
    
    if (!userProgress) {
      // Create progress record if it doesn't exist
      userProgress = await UserProgress.create({
        userId: user._id,
        activities: [{
          type: 'login',
          points: 5,
          details: 'Daily login',
        }],
      });
    } else {
      // Add login activity and update streak
      userProgress.updateStreak();
      userProgress.addPoints(5, 'login', 'Daily login');
      await userProgress.save();
    }
    
    // Create JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        name: user.name,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        level: user.level || 1,
        points: user.points || 0,
        streakDays: user.streakDays || 0
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDatabase();
    
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      level: user.level || 1,
      points: user.points || 0,
      streakDays: user.streakDays || 0,
      lastLogin: user.lastLogin
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}