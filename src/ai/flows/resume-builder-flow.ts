
'use server';

/**
 * @fileOverview An AI agent that generates a resume based on a client's intake form.
 *
 * - buildResume - A function that handles the resume generation.
 * - BuildResumeInput - The input type for the buildResume function (reuses IntakeFormInput).
 * - BuildResumeOutput - The return type for the buildResume function.
 */

import { ai } from '@/ai/genkit';
import {
    BuildResumeInputSchema,
    BuildResumeOutputSchema,
    type BuildResumeInput,
    type BuildResumeOutput,
} from '@/ai/schemas/resume-builder-schema';
import { z } from 'zod';

export { type BuildResumeInput, type BuildResumeOutput };

export async function buildResume(jsonString: string): Promise<BuildResumeOutput> {
  return resumeBuilderFlow(jsonString);
}

const prompt = ai.definePrompt({
  name: 'resumeBuilderPrompt',
  input: { schema: z.string() }, // Expects a JSON string
  output: { schema: BuildResumeOutputSchema },
  prompt: `You are an expert resume writer specializing in creating professional resumes for the Canadian job market. Generate a resume in Markdown format based on the following client data from the JSON string.

  Key Canadian Resume Standards to follow:
  - Do not include a photo.
  - Do not include personal details like age, marital status, or nationality.
  - Start with a professional summary (2-3 sentences).
  - List work experience in reverse chronological order.
  - Use action verbs to describe accomplishments (e.g., "Managed," "Developed," "Achieved").
  - Focus on quantifiable achievements where possible.
  - Keep the resume concise, ideally 1-2 pages.
  - Ensure contact information is clear and professional (Name, Phone, Email, Address).
  - Format dates consistently (e.g., Month Year - Month Year).
  - For education, list the most recent degree first.
  - Add a "Skills" section summarizing key technical and soft skills.

  Client Data (JSON):
  {{{json this}}}

  Generate a complete resume based on this data. Pay close attention to the work history and education sections to create a compelling professional narrative.
  `,
});

const resumeBuilderFlow = ai.defineFlow(
  {
    name: 'resumeBuilderFlow',
    inputSchema: z.string(),
    outputSchema: BuildResumeOutputSchema,
  },
  async (jsonString) => {
    const data = JSON.parse(jsonString);
    // The prompt now receives the full object after parsing, so template is updated
    const { output } = await prompt({
        clientName: data.clientName,
        clientContact: data.clientContact,
        clientWorkHistory: data.clientWorkHistory,
        clientEducation: data.clientEducation,
    });
    return output!;
  }
);
