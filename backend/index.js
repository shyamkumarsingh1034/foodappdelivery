import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => {
  connectDB(); // <-- yahan function call kiya gaya (pehle missing tha)
  console.log(`server started at ${port}`);
});
