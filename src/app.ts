import express from "express";
import routes from "@/routes";

const app = express();

app.use(express.json());

app.use("/webhook", routes);

export default app;
