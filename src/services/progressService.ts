import connectToDatabase from '@/lib/mongodb';
import UserProgress from '@/models/UserProgress';
import mongoose from 'mongoose';

export async function getUserProgress(userId: string) {
  try {
    await connectToDatabase();
    
    const userProgress = await UserProgress.findOne({ userId });
    if (!userProgress) {
      throw new Error('User progress not found');
    }
    
    return {
      level: userProgress.level,
      points: userProgress.points,
      streakDays: userProgress.streakDays,
      badges: userProgress.badges,
      completedSections: userProgress.completedSections,
      activities: userProgress.activities.slice(-10), // Return only the last 10 activities
    };
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
}

export async function addActivity(userId: string, activityType: string, points: number, details: string = '') {
  try {
    await connectToDatabase();
    
    // Find user progress
    let userProgress = await UserProgress.findOne({ userId });
    
    if (!userProgress) {
      // Create new progress record if it doesn't exist
      userProgress = await UserProgress.create({
        userId,
        activities: [],
      });
    }
    
    // Add points and activity
    userProgress.addPoints(points, activityType, details);
    
    // Update streak if it's a new day
    userProgress.updateStreak();
    
    // Save changes
    await userProgress.save();
    
    return {
      level: userProgress.level,
      points: userProgress.points,
      streakDays: userProgress.streakDays,
    };
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
}

export async function updateCompletedSections(userId: string, section: 'autism' | 'adhd' | 'dyslexia', increment: number = 1) {
  try {
    await connectToDatabase();
    
    // Find user progress
    let userProgress = await UserProgress.findOne({ userId });
    
    if (!userProgress) {
      // Create new progress record if it doesn't exist
      userProgress = await UserProgress.create({
        userId,
        activities: [],
      });
    }
    
    // Update completed sections
    userProgress.completedSections[section] += increment;
    
    // Add points for section completion
    userProgress.addPoints(15, 'resource_accessed', `Completed ${section} section`);
    
    // Save changes
    await userProgress.save();
    
    return userProgress.completedSections;
  } catch (error) {
    console.error('Error updating completed sections:', error);
    throw error;
  }
}

export async function addBadge(userId: string, badgeName: string, badgeDescription: string, icon: string = 'trophy') {
  try {
    await connectToDatabase();
    
    // Find user progress
    let userProgress = await UserProgress.findOne({ userId });
    
    if (!userProgress) {
      // Create new progress record if it doesn't exist
      userProgress = await UserProgress.create({
        userId,
        activities: [],
      });
    }
    
    // Check if badge already exists
    const badgeExists = userProgress.badges.some(badge => badge.name === badgeName);
    
    if (!badgeExists) {
      // Add new badge
      userProgress.badges.push({
        name: badgeName,
        description: badgeDescription,
        earnedAt: new Date(),
        icon,
      });
      
      // Add points for earning a badge
      userProgress.addPoints(25, 'badge_earned', `Earned badge: ${badgeName}`);
      
      // Save changes
      await userProgress.save();
    }
    
    return userProgress.badges;
  } catch (error) {
    console.error('Error adding badge:', error);
    throw error;
  }
}

export async function getLeaderboard(limit: number = 10) {
  try {
    await connectToDatabase();
    
    const leaderboard = await UserProgress.aggregate([
      { $sort: { points: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: 1,
          name: '$user.name',
          points: 1,
          level: 1,
          streakDays: 1,
          badges: { $size: '$badges' }
        }
      }
    ]);
    
    return leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}