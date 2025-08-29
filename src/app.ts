import express, { Request, Response } from "express";
import routes from "@/routes";

const app = express();

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "WhatsApp Chatbot API is running",
  });
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/webhook", routes);

export default app;
