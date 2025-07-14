
'use server';

/**
 * @fileOverview An AI agent that generates a resume based on a client's intake form.
 *
 * - buildResume - A function that handles the resume generation.
 * - BuildResumeInput - The input type for the buildResume function.
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

export type { BuildResumeInput, BuildResumeOutput };

const prompt = ai.definePrompt({
  name: 'resumeBuilderPrompt',
  input: { schema: BuildResumeInputSchema },
  output: { schema: BuildResumeOutputSchema },
  prompt: `You are an expert resume writer specializing in creating professional resumes for the Canadian job market. Generate a resume in Markdown format based on the following client data.

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

  **Client Name:** {{{clientName}}}
  **Contact:**
  - Email: {{{clientContact.email}}}
  - Phone: {{{clientContact.phone}}}
  - Address: {{{clientContact.address}}}

  **Work History:**
  {{#each clientWorkHistory}}
  - **{{this.position}}** at {{this.company}} ({{this.country}}) - *{{this.duration}}*
  {{/each}}
  
  **Education:**
  {{#each clientEducation}}
  - **{{this.degree}}**, {{this.institution}} ({{this.countryOfStudy}}) - *Completed {{this.yearCompleted}}*
  {{/each}}

  Generate a complete resume based on this data. Pay close attention to the work history and education sections to create a compelling professional narrative.
  `,
});

const resumeBuilderFlow = ai.defineFlow(
  {
    name: 'resumeBuilderFlow',
    inputSchema: BuildResumeInputSchema,
    outputSchema: BuildResumeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);


export async function buildResume(jsonString: string): Promise<BuildResumeOutput> {
  const input: BuildResumeInput = JSON.parse(jsonString);
  return resumeBuilderFlow(input);
}
