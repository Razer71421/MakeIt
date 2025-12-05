export type AppScreen = 'onboarding' | 'home' | 'camera' | 'result' | 'history';

export interface Material {
  name: string;
  description: string;
}

export interface ManufacturingStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface DIYStep {
  stepNumber: number;
  instruction: string;
  tip?: string;
}

export interface DIYGuide {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
  toolsRequired: string[];
  materialsNeeded: string[];
  steps: DIYStep[];
  safetyNotes: string[];
}

export interface ScanResult {
  id: string;
  timestamp: number;
  imageUrl: string; // Base64 or local URL
  objectName: string;
  confidence: number;
  shortDescription: string;
  materials: Material[];
  manufacturingProcess: ManufacturingStep[];
  diyGuide: DIYGuide;
}

export interface Settings {
  apiKey: string;
  useHighQuality: boolean;
}