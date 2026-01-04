import { z } from "zod";

export const UserSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(14, "Password length must be at least 14 characters long"),
});

export type UserType = z.infer<typeof UserSchema>;
