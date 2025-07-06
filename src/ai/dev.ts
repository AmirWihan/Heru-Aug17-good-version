import { config } from 'dotenv';
config();

import '@/ai/flows/document-summarization.ts';
import '@/ai/flows/application-checker.ts';
import '@/ai/flows/ai-assisted-messaging.ts';
import '@/ai/flows/crs-calculator.ts';
import '@/ai/flows/success-predictor.ts';
import '@/ai/flows/risk-analyzer.ts';
import '@/ai/flows/case-timeline-flow.ts';
import '@/ai/flows/intake-form-analyzer.ts';
