export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface Symptom {
  id: string;
  name: string;
  followUpQuestion?: string;
  options?: string[];
}

export interface PredictionResult {
  likelihood: number;
  confidence: 'High' | 'Medium' | 'Low';
  recommendations: string[];
}