import taskModel from "../models/taskModel.js";
import userModel from "../models/userModel.js";
import { createTransport } from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

// Email transporter instance (create once)
const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD
    }
});

// Improved email sending function with different templates
const sendMail = async (email, type, taskData) => {
    // Skip if email credentials are not set
    if (!process.env.GMAIL_USERNAME || !process.env.GMAIL_PASSWORD) {
        console.log('Email credentials not set. Skipping email notification.');
        return;
    }
    
    let subject, htmlContent;
    
    // Common CSS styles for all emails
    const styles = `
        .email-container {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4a6ee0;
            color: white;
            padding: 15px;
            border-radius: 6px 6px 0 0;
            text-align: center;
        }
        .content {
            background-color: white;
            padding: 20px;
            border-radius: 0 0 6px 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .task-title {
            color: #333;
            font-size: 22px;
            margin: 15px 0;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        .task-description {
            color: #555;
            font-size: 16px;
            margin-bottom: 15px;
            line-height: 1.5;
        }
        .task-meta {
            background-color: #f5f5f5;
            padding: 10px 15px;
            border-radius: 4px;
            margin-bottom: 15px;
        }
        .meta-item {
            margin: 8px 0;
            color: #666;
        }
        .status {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
            margin-top: 5px;
        }
        .status-completed {
            background-color: #4CAF50;
            color: white;
        }
        .status-active {
            background-color: #2196F3;
            color: white;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #777;
            font-size: 12px;
        }
        .action-button {
            display: inline-block;
            background-color: #4a6ee0;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 15px;
            font-weight: bold;
        }
    `;
    
    // Different email templates based on action type
    switch(type) {
        case 'add':
            subject = "Task Added Successfully";
            htmlContent = `
                <div class="email-container">
                    <div class="header">
                        <h1 style="margin: 0; font-size: 24px;">Task Added Successfully</h1>
                    </div>
                    <div class="content">
                        <h2 class="task-title">${taskData.title}</h2>
                        <div class="task-description">${taskData.description || 'No description provided'}</div>
                        
                        <div class="task-meta">
                            <div class="meta-item"><strong>Category:</strong> ${taskData.category || 'others'}</div>
                            <div class="meta-item"><strong>Created:</strong> ${new Date().toLocaleString()}</div>
                        </div>
                        
                        <a href="#" class="action-button">View Task</a>
                    </div>
                    <div class="footer">
                        <p>This is an automated message from your Todo App. Please do not reply to this email.</p>
                    </div>
                </div>
            `;
            break;
        case 'update':
            subject = "Task Updated Successfully";
            htmlContent = `
                <div class="email-container">
                    <div class="header">
                        <h1 style="margin: 0; font-size: 24px;">Task Updated Successfully</h1>
                    </div>
                    <div class="content">
                        <h2 class="task-title">${taskData.title}</h2>
                        <div class="task-description">${taskData.description || 'No description provided'}</div>
                        
                        <div class="task-meta">
                            <div class="meta-item"><strong>Category:</strong> ${taskData.category || 'others'}</div>
                            <div class="meta-item"><strong>Last Updated:</strong> ${new Date().toLocaleString()}</div>
                        </div>
                        
                        <a href="#" class="action-button">View Updated Task</a>
                    </div>
                    <div class="footer">
                        <p>This is an automated message from your Todo App. Please do not reply to this email.</p>
                    </div>
                </div>
            `;
            break;
        case 'delete':
            subject = "Task Deleted Successfully";
            htmlContent = `
                <div class="email-container">
                    <div class="header" style="background-color: #e74c3c;">
                        <h1 style="margin: 0; font-size: 24px;">Task Deleted Successfully</h1>
                    </div>
                    <div class="content">
                        <h2 class="task-title">${taskData.title}</h2>
                        <div class="task-description">${taskData.description || 'No description provided'}</div>
                        
                        <div class="task-meta">
                            <div class="meta-item"><strong>Deleted:</strong> ${new Date().toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="footer">
                        <p>This is an automated message from your Todo App. Please do not reply to this email.</p>
                    </div>
                </div>
            `;
            break;
        case 'complete':
            const statusColor = taskData.completed ? '#4CAF50' : '#2196F3';
            const statusText = taskData.completed ? 'Completed' : 'Active';
            const statusClass = taskData.completed ? 'status-completed' : 'status-active';
            
            subject = `Task Marked as ${statusText}`;
            htmlContent = `
                <div class="email-container">
                    <div class="header" style="background-color: ${statusColor};">
                        <h1 style="margin: 0; font-size: 24px;">Task Status Changed</h1>
                    </div>
                    <div class="content">
                        <h2 class="task-title">${taskData.title}</h2>
                        <div class="task-description">${taskData.description || 'No description provided'}</div>
                        
                        <div class="task-meta">
                            <div class="meta-item"><strong>Category:</strong> ${taskData.category || 'others'}</div>
                            <div class="meta-item"><strong>Status:</strong> <span class="status ${statusClass}">${statusText}</span></div>
                            <div class="meta-item"><strong>Updated:</strong> ${new Date().toLocaleString()}</div>
                        </div>
                        
                        <a href="#" class="action-button" style="background-color: ${statusColor};">View Task</a>
                    </div>
                    <div class="footer">
                        <p>This is an automated message from your Todo App. Please do not reply to this email.</p>
                    </div>
                </div>
            `;
            break;
        default:
            subject = "Task Notification";
            htmlContent = `
                <div class="email-container">
                    <div class="header">
                        <h1 style="margin: 0; font-size: 24px;">Task Notification</h1>
                    </div>
                    <div class="content">
                        <h2 class="task-title">${taskData.title}</h2>
                        <div class="task-description">${taskData.description || 'No description provided'}</div>
                        
                        <div class="task-meta">
                            <div class="meta-item"><strong>Category:</strong> ${taskData.category || 'others'}</div>
                        </div>
                    </div>
                    <div class="footer">
                        <p>This is an automated message from your Todo App. Please do not reply to this email.</p>
                    </div>
                </div>
            `;
    }

    var mailOptions = {
        from: process.env.GMAIL_USERNAME || 'alok.yadav6000@gmail.com',
        to: email,
        subject: subject,
        html: `
            <style>
                ${styles}
            </style>
            ${htmlContent}
        `
    };

    try {
        // Send email asynchronously without awaiting
        transporter.sendMail(mailOptions)
            .then(info => console.log('Email sent: ' + info.response))
            .catch(error => console.log('Error sending email:', error));
            
        return true;
    } catch (error) {
        console.log('Error setting up email:', error);
        return false;
    }
}

// Non-blocking email sending function
const sendEmailInBackground = (email, type, taskData) => {
    // Use setImmediate to move email sending to the next event loop iteration
    setImmediate(() => {
        sendMail(email, type, taskData)
            .catch(err => console.error('Background email error:', err));
    });
};

const addTask = async (req, res) => {
    const { title, description, category } = req.body;
    const userId = req.user.id;
    
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const newTask = new taskModel({ 
            title, 
            description, 
            category: category || 'others', // Default to 'others' if not provided
            completed: false, 
            userId 
        });
        
        const savedTask = await newTask.save();
        
        // Send email notification in background
        sendEmailInBackground(user.email, "add", savedTask);
        
        return res.status(200).json(savedTask);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const removeTask = async (req, res) => {
    const { id } = req.body;
    
    try {
        const task = await taskModel.findById(id);
        
        // Check if task exists
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        
        // Check if user owns this task
        if (task.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this task" });
        }
        
        // Get user email before deleting the task
        const user = await userModel.findById(req.user.id);
        
        // Delete the task
        await taskModel.findByIdAndDelete(id);
        
        // Send email notification in background after response is sent
        sendEmailInBackground(user.email, "delete", task);
        
        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getTask = async (req, res) => {
    try {
        // Get all tasks for the user
        const tasks = await taskModel.find({ userId: req.user.id });
        return res.status(200).json(tasks);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateTask = async (req, res) => {
    const { id, title, description, category } = req.body;
    try {
        const task = await taskModel.findById(id);
        
        // Check if task exists
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        
        // Check if user owns this task
        if (task.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to update this task" });
        }

        // Update task
        const updatedTask = await taskModel.findByIdAndUpdate(
            id,
            { title, description, category },
            { new: true } // Returns the updated document
        );
        
        // Get user email
        const user = await userModel.findById(req.user.id);
        
        // Send email notification in background
        sendEmailInBackground(user.email, "update", updatedTask);

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const markDone = async (req, res) => {
    const { id } = req.body;
    try {
        const task = await taskModel.findById(id);
        
        // Check if task exists
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        
        // Check if user owns this task
        if (task.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to update this task" });
        }

        // Toggle completed status
        const updatedTask = await taskModel.findByIdAndUpdate(
            id,
            { completed: !task.completed },
            { new: true }
        );
        
        // Get user email
        const user = await userModel.findById(req.user.id);
        
        // Send email notification in background
        sendEmailInBackground(user.email, "complete", updatedTask);

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { addTask, getTask, removeTask, updateTask, markDone }
