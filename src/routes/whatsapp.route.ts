import { Router, Request, Response } from "express";
import axios from 'axios';

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

router.post("/", async (req: Request, res: Response) => {
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);

  const requestBody = req.body;
  const messageType = requestBody.entry[0].changes[0].value.messages[0].type;
  console.log(JSON.stringify(requestBody.entry[0].changes[0].value.messages[0][messageType].body, null, 2));

  let satyaRes: any[] = [];

  if (messageType === "text") {
    const textBody = requestBody.entry[0].changes[0].value.messages[0][messageType].body;

    try {
      const response = await axios.post("https://satyashield-backend-60le.onrender.com/api/run_agent", {
        query: textBody
      });
      satyaRes = response.data;
    } catch (error: any) {
      console.error("Error calling backend:", error.message);
    }
  }

  let bodyText = "";
  satyaRes.forEach((item, index) => {
    bodyText += `Claim ${index + 1}: ${item.claim}\n`;
    bodyText += `Verdict: ${item.verdict} (Confidence: ${item.confidence}%)\n`;
    bodyText += `Explanation: ${item.explanation}\n`;
    if (item.sources && item.sources.length > 0) {
      bodyText += `Sources:\n${item.sources.map((s: string) => `- ${s}`).join("\n")}\n`;
    }
    bodyText += "\n"; 
  });

  const API_VERSION = process.env.WHATSAPP_API_VERSION || "v22.0";
  const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
  const TO_NUMBER = requestBody.entry[0].changes[0].value.messages[0].from;
  const ENABLE_LINK_PREVIEW = true;

  const url = `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`;

  const data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: TO_NUMBER,
    type: "text",
    text: {
      preview_url: ENABLE_LINK_PREVIEW,
      body: bodyText || "Sorry, no response available."
    }
  };
  console.log(data)

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`
      }
    });
    console.log("Message sent:", response.data);
  } catch (error: any) {
    console.error("Error sending message:", error.response?.data || error.message);
  }
  console.log("Fin")
  res.status(200).end();
});

export default router;
