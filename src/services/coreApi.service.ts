import { ApiResponse } from "@/types/coreApi.types";
import axios from "axios";
import FormData from "form-data";

export const runTextCheck = async (query: string): Promise<ApiResponse[]> => {
    try {
        const { data } = await axios.post("https://satyashield-backend-60le.onrender.com/api/run_agent", {
            query
        });
        return data;
    } catch (error: any) {
        console.error("Backend Api error:", error.message);
        return [];
    }
}


export async function runImageCheck(buffer: Buffer, filename: string, mimeType: string): Promise<ApiResponse[]> {
    try {
        const formData = new FormData();
        formData.append("file", buffer, { filename, contentType: mimeType });

        const { data } = await axios.post(
            "https://satyashield-backend-60le.onrender.com/api/read_image_file",
            formData,
            { headers: formData.getHeaders() }
        );

        return data;
    } catch (error: any) {
        console.error("Backend API error (image):", error.message);
        return [];
    }
}
