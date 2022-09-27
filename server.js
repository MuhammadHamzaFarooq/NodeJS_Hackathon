import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import { BASE_URL } from "./utils/constant.js";
import { AuthRouter } from "./api/routes/auth/authRouter.js";
import connectDB from './config/dbConnection.js';
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"));

//Database Connection
connectDB("mongodb://localhost:27017/hackathonDB");

// Routes
app.use(`${BASE_URL}`, AuthRouter);

//Server Listen
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port} `);
});
