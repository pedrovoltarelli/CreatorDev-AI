export interface Pain {
  id: string;
  user_id: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface PainProject {
  id: string;
  pain_id: string;
  user_id: string;
  description: string;
  title?: string;
  functions?: string[];
  features?: string[];
  endpoints?: string[];
  database?: string[];
  architecture?: string;
  auth?: string;
  deployment?: string;
  is_ai_generated: boolean;
  created_at: string;
  updated_at: string;
}