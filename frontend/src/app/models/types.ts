export interface UploadResponse {
  status: string;
  chunks: number;
  source: string;
}

export interface AskResponse {
  answer: string;
  sources: string[];
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
}
