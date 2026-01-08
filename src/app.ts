import express from "express";
import { corsMiddleware } from "./config/cors.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json());

//app.use("/api", router)

app.use(errorHandler);
export default app;
