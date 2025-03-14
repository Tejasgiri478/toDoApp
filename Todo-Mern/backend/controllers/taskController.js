import taskModel from "../models/taskModel.js";
import userModel from "../models/userModel.js";
import { createTransport } from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();
const sendMail = (email, subject, title, description) => {
    var transporter = createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD
        }
    });

    var mailOptions = {
        from: 'alok.yadav6000@gmail.com',
        to: email,
        subject: subject,
        html:`<h1>Task added successfully</h1><h2>Title: ${title}</h2><h3>Description: ${description}</h3>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
const addTask = async (req, res) => {
    const { title, description, category } = req.body;
    const userId = req.user.id;
    const user = await userModel.find({_id: userId});
    const newTask = new taskModel({ 
        title, 
        description, 
        category: category || 'others', // Default to 'others' if not provided
        completed: false, 
        userId 
    })
    try {
        const savedTask = await newTask.save();
        sendMail(user[0].email, "Task Added", title, description);
        return res.status(200).json(savedTask);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
const removeTask = (req, res) => {
    const { id } = req.body;
    console.log("id: ", id);
    taskModel.findByIdAndDelete(id)
        .then(() => res.status(200).json({ message: "Task deleted successfully" }))
        .catch((error) => res.status(501).json({ message: error.message }))
}

const getTask = (req, res) => {
    taskModel.find({ userId: req.user.id })
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(501).json({ message: error.message }))
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

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { addTask, getTask, removeTask, updateTask, markDone }
