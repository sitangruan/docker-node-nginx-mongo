import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import { router as tasksRouter } from './routes/tasks.js';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://root:example@mongo:27017/todo?authSource=admin';

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/health', (req, res) => res.json({ status: 'OK', name: 'Sitang mongo api 1' }));
app.use('/api/tasks', tasksRouter);


// Connect to MongoDB and start server
console.log('Before connecting to MongoDB');
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`In node app, the server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });