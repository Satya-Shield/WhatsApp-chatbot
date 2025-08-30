import { ApiResponse } from "@/types/coreApi.types";
import axios from "axios";

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