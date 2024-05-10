import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import dataConnect from "../backend/config/dataConnect.js";
import initRouters from "../backend/Routes/index.js";
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());


dotenv.config();
dataConnect();
const PORT = process.env.PORT;
initRouters(app)
app.listen(PORT, () => {
    console.log(`http://locallhost:${PORT}`);
});
