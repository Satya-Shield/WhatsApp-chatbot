import { Router } from "express";
import whatsappRoutes from "@/routes/whatsapp.route"

const router = Router();

router.use("/whatsapp",whatsappRoutes )

export default router;
