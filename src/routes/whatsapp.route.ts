import { Router } from "express";
import { handleWhatsappWebhook, verifyWhatsappWebhook } from "@/controllers/whatsapp.controller";

const router = Router();

const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

router.get("/", verifyWhatsappWebhook);

router.post("/", handleWhatsappWebhook);

export default router;
