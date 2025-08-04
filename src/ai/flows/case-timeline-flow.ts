
'use server';

/**
 * @fileOverview An AI agent that generates a personalized immigration case timeline.
 *
 * - getCaseTimeline - A function that generates a timeline based on a client's data.
 * - CaseTimelineInput - The input type for the getCaseTimeline function.
 * - CaseTimelineOutput - The return type for the getCaseTimeline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const CaseTimelineInputSchema = z.object({
  visaType: z.string().describe('The type of visa or immigration program the client is applying for (e.g., Express Entry, Student Visa).'),
  currentStage: z.string().describe('The current stage of the application process (e.g., "Awaiting Documents", "Submitted").'),
  countryOfOrigin: z.string().describe("The client's country of origin, which can affect processing times."),
});
export type CaseTimelineInput = z.infer<typeof CaseTimelineInputSchema>;

const TimelineStepSchema = z.object({
  title: z.string().describe('The name of this step in the timeline (e.g., "Biometrics Appointment").'),
  status: z.enum(['Completed', 'In Progress', 'Upcoming']).describe('The current status of this step.'),
  estimatedDuration: z.string().describe('A human-readable estimated duration or processing time for this step (e.g., "1-2 weeks", "Approx. 3 months").'),
  description: z.string().describe('A brief, helpful description of what this step involves for the client.'),
  dueDate: z.string().optional().describe('An optional specific deadline for this step in YYYY-MM-DD format, if applicable.'),
});

const CaseTimelineOutputSchema = z.object({
  timeline: z.array(TimelineStepSchema).describe('The personalized immigration timeline, consisting of a sequence of steps.'),
});
export type CaseTimelineOutput = z.infer<typeof CaseTimelineOutputSchema>;

const prompt = ai.definePrompt({
  name: 'caseTimelinePrompt',
  input: { schema: CaseTimelineInputSchema },
  output: { schema: CaseTimelineOutputSchema },
  prompt: `You are an expert Canadian immigration case timeline assistant. Your role is to generate a personalized, estimated timeline for a client based on their profile.

  Analyze the client's data from the provided input to create a realistic sequence of key steps. For each step, provide an estimated duration based on current trends, the client's visa type, and countryOfOrigin (as some countries have different processing speeds). Mark steps before the client's current stage as 'Completed', the current stage as 'In Progress', and subsequent steps as 'Upcoming'.

  The timeline must include critical milestones like document submission, biometrics, medical exams, and the final decision. Provide a helpful, client-friendly description for each step.

  Client Profile:
  - Visa Type: {{{visaType}}}
  - Current Stage: {{{currentStage}}}
  - Country of Origin: {{{countryOfOrigin}}}

  Generate a clear, step-by-step timeline based on this information.
  `,
});

const caseTimelineFlow = ai.defineFlow(
  {
    name: 'caseTimelineFlow',
    inputSchema: CaseTimelineInputSchema,
    outputSchema: CaseTimelineOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("Failed to get timeline from AI.");
    }
    return output;
  }
);

export async function getCaseTimeline(input: CaseTimelineInput): Promise<CaseTimelineOutput> {
    try {
        return await caseTimelineFlow(input);
    } catch (error) {
        console.warn('AI timeline generation failed, using fallback:', error);
        
        // Fallback timeline when AI is not available
        const fallbackTimeline = [
            {
                title: "Document Collection",
                status: "Completed" as const,
                estimatedDuration: "2-3 weeks",
                description: "Gathering all required documents for your application",
                dueDate: "2024-01-15"
            },
            {
                title: "Application Submission",
                status: "In Progress" as const,
                estimatedDuration: "1-2 weeks",
                description: "Submitting your complete application package",
                dueDate: "2024-02-01"
            },
            {
                title: "Biometrics Appointment",
                status: "Upcoming" as const,
                estimatedDuration: "2-4 weeks",
                description: "Attending your biometrics appointment at a designated center",
                dueDate: "2024-02-15"
            },
            {
                title: "Medical Examination",
                status: "Upcoming" as const,
                estimatedDuration: "1-2 weeks",
                description: "Completing your medical examination with an approved physician",
                dueDate: "2024-03-01"
            },
            {
                title: "Application Review",
                status: "Upcoming" as const,
                estimatedDuration: "3-6 months",
                description: "IRCC reviewing your application and conducting background checks",
                dueDate: "2024-09-01"
            },
            {
                title: "Decision",
                status: "Upcoming" as const,
                estimatedDuration: "1-2 weeks",
                description: "Receiving the final decision on your application",
                dueDate: "2024-09-15"
            }
        ];
        
        return {
            timeline: fallbackTimeline
        };
    }
}
