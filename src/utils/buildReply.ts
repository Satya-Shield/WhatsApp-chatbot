import { ApiResponse } from "@/types/coreApi.types";

export const buildReply = (result: ApiResponse): string => {
  let bodyText: string = "";

  bodyText += `*📌 Claim:* ${result.claim}\n\n`;
  bodyText += `*✅ Verdict:* *${result.verdict}*  \n`;
  bodyText += `*📊 Confidence:* ${result.confidence}%\n\n`;
  bodyText += `*📝 Explanation:* ${result.explanation}\n\n`;

  if (result.sources && result.sources.length > 0) {
    bodyText += `*🔗 Sources:*\n${result.sources.map((s: string) => `▪️ ${s}`).join("\n")}\n`;
  }

  return bodyText.trim();
};
