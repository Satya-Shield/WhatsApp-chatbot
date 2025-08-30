import axios from "axios";

const API_VERSION = process.env.WHATSAPP_API_VERSION || "v22.0";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const ENABLE_LINK_PREVIEW = true;

const url = `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`;

export const sendWhatsappTextMessage = async (to: string, body: string) => {
    const data = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "text",
        text: {
            preview_url: ENABLE_LINK_PREVIEW,
            body: body || "Sorry, no response available."
        }
    };

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


}

export async function getWhatsappMediaUrl(mediaId: string) {
  try {
    const { data } = await axios.get(`https://graph.facebook.com/${API_VERSION}/${mediaId}`, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
    });
    return data;
  } catch (error: any) {
    console.error("Error fetching media metadata:", error.response?.data || error.message);
    return null;
  }
}

export async function downloadWhatsappMedia(mediaUrl: string) {
  try {
    const response = await axios.get(mediaUrl, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      responseType: "arraybuffer"
    });
    return response.data;
  } catch (error: any) {
    console.error("Error downloading media:", error.response?.data || error.message);
    return null;
  }
}