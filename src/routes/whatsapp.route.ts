import { Router, Request, Response } from "express";

const router = Router();

const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

router.get("/", (req: Request, res: Response) => {
  const { "hub.mode": mode, "hub.challenge": challenge, "hub.verify_token": token } = req.query;

  if (mode === "subscribe" && token === verifyToken) {
    console.log("WEBHOOK VERIFIED");
    res.status(200).send(challenge as string);
  } else {
    res.status(403).end();
  }
});

router.post("/", (req: Request, res: Response) => {
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).end();
});

export default router;