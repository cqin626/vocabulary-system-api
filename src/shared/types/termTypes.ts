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

const SenseSchema = z.object({
  type: SenseTypeEnum,
  definition: z.string().trim().min(1, "Sense definition cannot be empty"),
  examples: z
    .array(z.string().trim().min(1))
    .min(1, "At least one example is required"),
});

export const TermSchema = z.object({
  text: z.string().trim().min(1, "Term text cannot be empty"),
  senses: z.array(SenseSchema).min(1, "At least one sense is required"),
});

export type SenseTypeEnum = z.infer<typeof SenseTypeEnum>;
export type SenseType = z.infer<typeof SenseSchema>;
export type TermType = z.infer<typeof TermSchema>;
