import { Request, Response } from "express";
import { buildReply } from "@/utils/buildReply";
import { runImageCheck, runTextCheck } from "@/services/coreApi.service";
import { downloadWhatsappMedia, getWhatsappMediaUrl, sendWhatsappTextMessage } from "@/services/whatsapp.service";
import mime from 'mime-types'

const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN!;

export const verifyWhatsappWebhook = (req: Request, res: Response) => {
  const { "hub.mode": mode, "hub.challenge": challenge, "hub.verify_token": token } = req.query;
  if (mode === "subscribe" && token === verifyToken) {
    console.log("WEBHOOK VERIFIED");
    return res.status(200).send(challenge as string);
  }
  return res.sendStatus(403);
};

export const handleWhatsappWebhook = async (req: Request, res: Response) => {
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));

  res.sendStatus(200);

  (async () => {
    const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!message) return;

    let reply = "Sorry, no response available.";

    if (message.type === "text") {
      const satyaRes = await runTextCheck(message.text.body);
      reply = satyaRes.map((item, index) => buildReply(item, index)).join("\n\n");
    } else if (message.type === "image") {
      const mediaId = message.image.id;
      let caption = message.image?.caption || "Verify the information";
      console.log("Received image with ID:", mediaId);

      const meta = await getWhatsappMediaUrl(mediaId);
      if (meta?.url) {
        const mediaBuffer = await downloadWhatsappMedia(meta.url);
        if (mediaBuffer) {
          const extension = mime.extension(meta.mime_type) || "bin";
          const fileName = `${mediaId}.${extension}`;
          const satyaRes = await runImageCheck(mediaBuffer, fileName, meta.mime_type, caption);
          reply = satyaRes.map((item, index) => buildReply(item, index)).join("\n\n");
        }
      }
    }

    await sendWhatsappTextMessage(message.from, reply);
  })();
};
