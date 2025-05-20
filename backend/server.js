import express from "express";
import 'dotenv/config';
import authRoutes from './routes/authRoutes.js';
import {connectDB} from './lib/db.js';
const PORT = process.env.PORT;
const app = express();
app.use('/api/auth',authRoutes);

app.listen(PORT,()=>{
    console.log(`listening to the ${PORT}`);
    connectDB();
})