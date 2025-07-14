
'use server';

/**
 * @fileOverview An AI agent that generates a cover letter based on a client's intake form and a job description.
 *
 * - buildCoverLetter - A function that handles the cover letter generation.
 * - BuildCoverLetterInput - The input type for the buildCoverLetter function.
 * - BuildCoverLetterOutput - The return type for the buildCoverLetter function.
 */

import { ai } from '@/ai/genkit';
import { 
    BuildCoverLetterInputSchema, 
    BuildCoverLetterOutputSchema, 
    type BuildCoverLetterInput, 
    type BuildCoverLetterOutput 
} from '@/ai/schemas/cover-letter-schema';

const prompt = ai.definePrompt({
  name: 'coverLetterBuilderPrompt',
  input: { schema: BuildCoverLetterInputSchema },
  output: { schema: BuildCoverLetterOutputSchema },
  prompt: `You are an expert career coach specializing in writing compelling cover letters for the Canadian job market. Generate a professional cover letter in Markdown format based on the client's data and the provided job description.

  **Instructions:**
  1.  **Address the Company:** Start with a professional salutation addressed to the hiring manager at {{{companyName}}}. If no specific name is available, use a general title.
  2.  **Introduction:** State the position being applied for ({{{jobTitle}}}) and where it was seen. Briefly introduce the client, {{{clientName}}}, and express enthusiasm.
  3.  **Body Paragraphs:**
      *   Analyze the client's work history and skills from their data.
      *   Compare these with the requirements in the job description.
      *   Highlight 2-3 key experiences or skills that make the client a strong fit for the role. Use specific examples and quantify achievements where possible.
      *   Connect the client's qualifications directly to the needs mentioned in the job description.
  4.  **Closing:** Reiterate interest in the position and the company. Mention the attached resume and express eagerness for an interview.
  5.  **Tone:** Maintain a professional, confident, and enthusiastic tone throughout.

  **Client's Work History:**
  {{#each clientWorkHistory}}
  - Company: {{this.company}}, Position: {{this.position}}, Duration: {{this.duration}}, Country: {{this.country}}
  {{/each}}

  **Client's Education:**
  {{#each clientEducation}}
  - Degree: {{this.degree}}, Institution: {{this.institution}}, Year: {{this.yearCompleted}}, Country: {{this.countryOfStudy}}
  {{/each}}

  **Job Description:**
  ---
  {{{jobDescription}}}
  ---

  Generate the complete cover letter based on this information.
  `,
});

const coverLetterBuilderFlow = ai.defineFlow(
  {
    name: 'coverLetterBuilderFlow',
    inputSchema: BuildCoverLetterInputSchema,
    outputSchema: BuildCoverLetterOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function buildCoverLetter(jsonString: string): Promise<BuildCoverLetterOutput> {
  const input: BuildCoverLetterInput = JSON.parse(jsonString);
  return coverLetterBuilderFlow(input);
}
