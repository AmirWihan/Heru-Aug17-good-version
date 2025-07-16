
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
import '@/ai/flows/ircc-chat-flow.ts';
import '@/ai/flows/resume-builder-flow.ts';
import '@/ai/flows/document-analyzer.ts';
import '@/ai/flows/cover-letter-flow.ts';
import '@/ai/flows/writing-assistant-flow.ts';

import '@/ai/schemas/risk-analyzer-schema';
