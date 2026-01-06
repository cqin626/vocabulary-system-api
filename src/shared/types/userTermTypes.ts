import { z } from "zod";

export const UserTermFamiliarityEnumSchema = z.enum(
  ["NEW", "RECOGNIZED", "FAMILIAR"],
  "Familiarity status must be valid"
);

export type UserTermFamiliarityEnum = z.infer<
  typeof UserTermFamiliarityEnumSchema
>;
