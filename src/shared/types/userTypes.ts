import { z } from "zod";

const UserRoleEnumSchema = z.enum(["ADMIN", "USER"]);

export const UserSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(14, "Password length must be at least 14 characters long"),
});

export const UserTokenSchema = z.object({
  id: z.number(),
  email: z.string(),
  role: UserRoleEnumSchema,
});

export type UserType = z.infer<typeof UserSchema>;
export type UserTokenType = z.infer<typeof UserTokenSchema>;
