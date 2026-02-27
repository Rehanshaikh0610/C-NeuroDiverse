import connectToDatabase from '@/lib/mongodb';
import Task from '@/models/Task';
import UserProgress from '@/models/UserProgress';

export async function getAllTasks(userId: string) {
  try {
    await connectToDatabase();
    
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

export async function getTaskById(taskId: string) {
  try {
    await connectToDatabase();
    
    const task = await Task.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    
    return task;
  } catch (error) {
    console.error('Error fetching task:', error);
    throw error;
  }
}

export async function createTask(userId: string, taskData: any) {
  try {
    await connectToDatabase();
    
    // Add userId to task data
    const taskWithUser = {
      ...taskData,
      userId
    };
    
    const task = await Task.create(taskWithUser);
    
    // Update user progress for task creation
    const userProgress = await UserProgress.findOne({ userId });
    if (userProgress) {
      userProgress.addPoints(5, 'task_created', `Created task: ${task.title}`);
      await userProgress.save();
    }
    
    return task;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

export async function updateTask(taskId: string, userId: string, updateData: any) {
  try {
    await connectToDatabase();
    
    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      throw new Error('Task not found or unauthorized');
    }
    
    // Check if task is being marked as completed
    const isCompletingTask = !task.completed && updateData.completed === true;
    
    // Update the task
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    
    // If task is being completed, update user progress
    if (isCompletingTask) {
      const userProgress = await UserProgress.findOne({ userId });
      if (userProgress) {
        userProgress.addPoints(10, 'task_completed', `Completed task: ${task.title}`);
        await userProgress.save();
      }
    }
    
    return updatedTask;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}

export async function deleteTask(taskId: string, userId: string) {
  try {
    await connectToDatabase();
    
    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      throw new Error('Task not found or unauthorized');
    }
    
    await Task.findByIdAndDelete(taskId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}