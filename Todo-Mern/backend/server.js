import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import rateLimit from "express-rate-limit"

import config from "./config/config.js"
import logger from "./utils/logger.js"
import userRouter from "./routes/userRoute.js"
import taskRouter from "./routes/taskRoute.js"
import forgotPasswordRouter from "./routes/forgotPassword.js"
import adminRouter from "./routes/adminRoute.js"
import { notFound, errorHandler } from "./middleware/errorHandler.js"
import adminModel from "./models/adminModel.js"

//app config
const app = express()
const port = config.port
mongoose.set('strictQuery', true);

// Rate limiter
const limiter = rateLimit(config.rateLimit);

//middlewares
app.use(express.json())
app.use(cors())
app.use(helmet()) // Security headers

// Custom morgan token for logging with our logger
morgan.token('custom', (req, res) => {
  return JSON.stringify({
    method: req.method,
    url: req.url,
    status: res.statusCode,
    responseTime: res.responseTime
  });
});

// Use morgan with our custom format
app.use(morgan((tokens, req, res) => {
  logger.http(`${tokens.method(req, res)} ${tokens.url(req, res)} ${tokens.status(req, res)} - ${tokens['response-time'](req, res)} ms`);
  return null; // Don't output anything to console directly
}));

app.use(limiter) // Rate limiting

//db config
mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
})
.then(() => {
    logger.info("Database connected successfully");
    // Create default admin account if none exists
    adminModel.createDefaultAdmin();
})
.catch((err) => logger.error("Database connection error", { error: err.message }));

//api endpoints
app.use("/api/user", userRouter)
app.use("/api/task", taskRouter)
app.use("/api/forgotPassword", forgotPasswordRouter)
app.use("/api/admin", adminRouter)

// Error handling
app.use(notFound);
app.use(errorHandler);

//listen
app.listen(port, () => logger.info(`Server running on port ${port}`))