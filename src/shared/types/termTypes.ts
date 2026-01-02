import { z } from "zod";

const SenseTypeEnum = z.enum(
  [
    "NOUN",
    "VERB",
    "ADJECTIVE",
    "ADVERB",
    "PRONOUN",
    "PREPOSITION",
    "CONJUNCTION",
    "INTERJECTION",
    "PHRASAL_VERB",
    "IDIOM",
    "PHRASE",
  ],
  "Sense type must be valid"
);

const NewSenseSchema = z.object({
  type: SenseTypeEnum,
  definition: z.string().trim().min(1, "Sense definition cannot be empty"),
  examples: z
    .array(z.string().trim().min(1))
    .min(1, "At least one example is required"),
});

export const NewTermSchema = z.object({
  text: z.string().trim().min(1, "Term text cannot be empty"),
  senses: z.array(NewSenseSchema).min(1, "At least one sense is required"),
});

export type SenseType = z.infer<typeof SenseTypeEnum>;
export type NewSense = z.infer<typeof NewSenseSchema>;
export type NewTerm = z.infer<typeof NewTermSchema>;
