import express from "express"
import { addTask, getTask, removeTask, updateTask, markDone } from "../controllers/taskController.js"
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

router.post("/addTask", requireAuth, addTask)
router.get("/getTask", requireAuth, getTask)
router.delete("/removeTask", requireAuth, removeTask)  // Changed from GET to DELETE
router.put("/updateTask", requireAuth, updateTask)     // Added new update route
router.put("/markDone", requireAuth, markDone)

export default router;