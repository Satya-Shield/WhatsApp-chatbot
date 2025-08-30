export interface ApiResponse {
  claim: string;
  verdict: string;
  confidence: number;
  explanation: string;
  sources?: string[];
  techniques?: string[];
  checklist?: string[];
}
