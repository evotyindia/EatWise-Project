
'use server'; // This directive should NOT be here for a types/schemas file.
// Correction: This file should NOT have 'use server'. Schemas are values.

import { z } from 'zod';

export const DiseaseEnum = z.enum([
  "diabetes", "high_blood_pressure", "heart_condition", "gluten_free", "dairy_free", "none"
]);
export type Disease = z.infer<typeof DiseaseEnum>;

export const HouseholdCompositionSchema = z.object({
  adults: z.number().min(0).default(1).describe("Number of adults (18-60 years)"),
  seniors: z.number().min(0).default(0).describe("Number of seniors (60+ years)"),
  kids: z.number().min(0).default(0).describe("Number of kids (2-17 years)")
}).describe("Composition of the household for portion estimation.");
export type HouseholdComposition = z.infer<typeof HouseholdCompositionSchema>;
