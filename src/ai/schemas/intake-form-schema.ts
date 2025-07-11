/**
 * @fileOverview Defines the Zod schema and TypeScript types for the client intake form.
 * This schema is shared between multiple AI flows.
 */
import {z} from 'zod';

const FamilyMemberSchema = z.object({
    fullName: z.string(),
    relationship: z.string(),
    dateOfBirth: z.string(),
    countryOfBirth: z.string(),
    currentAddress: z.string(),
    occupation: z.string(),
});

export const IntakeFormInputSchema = z.object({
  personal: z.object({
    fullName: z.string(),
    dateOfBirth: z.string(),
    countryOfBirth: z.string(),
    countryOfCitizenship: z.string(),
    passportNumber: z.string(),
    passportExpiry: z.string(),
    height: z.string(),
    eyeColor: z.string(),
    contact: z.object({
        email: z.string(),
        phone: z.string(),
        address: z.string(),
    }),
  }),
  family: z.object({
    maritalStatus: z.string(),
    spouse: FamilyMemberSchema.optional(),
    mother: FamilyMemberSchema.optional(),
    father: FamilyMemberSchema.optional(),
    children: z.array(FamilyMemberSchema).optional(),
    siblings: z.array(FamilyMemberSchema).optional(),
  }),
  education: z.array(z.object({
    institution: z.string(),
    degree: z.string(),
    yearCompleted: z.string(),
    countryOfStudy: z.string(),
  })),
   studyDetails: z.object({
    schoolName: z.string(),
    programName: z.string(),
    dliNumber: z.string(),
    tuitionFee: z.string(),
    livingExpenses: z.string(),
  }).optional(),
  workHistory: z.array(z.object({
    company: z.string(),
    position: z.string(),
    duration: z.string(),
    country: z.string(),
  })),
  languageProficiency: z.object({
    englishScores: z.object({ listening: z.number(), reading: z.number(), writing: z.number(), speaking: z.number() }).optional(),
    frenchScores: z.object({ listening: z.number(), reading: z.number(), writing: z.number(), speaking: z.number() }).optional(),
  }),
  travelHistory: z.array(z.object({
    country: z.string(),
    purpose: z.string(),
    duration: z.string(),
    year: z.string(),
  })),
  immigrationHistory: z.object({
    previouslyApplied: z.enum(['yes', 'no']),
    previousApplicationDetails: z.string().optional(),
    wasRefused: z.enum(['yes', 'no']),
    refusalDetails: z.string().optional(),
  }),
  admissibility: z.object({
    hasCriminalRecord: z.enum(['yes', 'no']),
    criminalRecordDetails: z.string().optional(),
    hasMedicalIssues: z.enum(['yes', 'no']),
    medicalIssuesDetails: z.string().optional(),
    hasOverstayed: z.enum(['yes', 'no']).optional(),
    overstayDetails: z.string().optional(),
  }),
});

export type IntakeFormInput = z.infer<typeof IntakeFormInputSchema>;
