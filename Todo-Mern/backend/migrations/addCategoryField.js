import mongoose from 'mongoose';
import dotenv from 'dotenv';
import taskModel from '../models/taskModel.js';

dotenv.config();

const migrateTasks = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Update all tasks that don't have a category field
        const result = await taskModel.updateMany(
            { category: { $exists: false } },
            { $set: { category: 'others' } }
        );

        console.log(`Updated ${result.modifiedCount} tasks with default category`);
        
        mongoose.connection.close();
    } catch (error) {
        console.error('Migration error:', error);
    }
};

migrateTasks(); 