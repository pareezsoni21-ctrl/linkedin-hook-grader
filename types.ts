import type { ScoreResult } from './scoring';

export type Rewrite = {
  style: 'curiosity' | 'specificity' | 'contrarian';
  hook: string;
  why_it_works: string;
};

export type GradeApiResponse = {
  score: ScoreResult;
  rewrites: Rewrite[];
  ai_provider: 'gemini' | 'local-fallback';
  saved: boolean;
  webhook_sent: boolean;
  notices: string[];
  record_id?: string;
};
