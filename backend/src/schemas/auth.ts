import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "name is required").max(100),
  email: z.string().trim().min(1, "email is required").email("email must be valid").toLowerCase(),
  password: z
    .string()
    .min(8, "password must be at least 8 characters")
    .max(72, "password must be at most 72 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().min(1, "email is required").email("email must be valid").toLowerCase(),
  password: z.string().min(1, "password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
