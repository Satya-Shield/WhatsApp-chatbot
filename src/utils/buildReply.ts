import { ApiResponse } from "@/types/coreApi.types";

export const buildReply = (result: ApiResponse, index: number): string => {
    let bodyText: string = "";
    bodyText += `Claim ${index + 1}: ${result.claim}\n`;
    bodyText += `Verdict: ${result.verdict} (Confidence: ${result.confidence}%)\n`;
    bodyText += `Explanation: ${result.explanation}\n`;
    if (result.sources && result.sources.length > 0) {
      bodyText += `Sources:\n${result.sources.map((s: string) => `- ${s}`).join("\n")}\n`;
    }
    return bodyText;
}