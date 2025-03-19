import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import todoRoutes from "./routes/todo.route.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'your_mongodb_connection_string')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use('/api/todos', todoRoutes); 


app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Express + MongoDB API' });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
