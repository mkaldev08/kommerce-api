import { z } from "zod";

export const createStudentBodySchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phoneNumber: z.string().trim().optional().or(z.literal("")),
  guardianName: z.string().trim().optional().or(z.literal("")),
  guardianPhoneNumber: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal("")),
});

export const updateStudentBodySchema = createStudentBodySchema.partial();

export const studentParamsSchema = z.object({
  businessUnitId: z.string().uuid(),
  id: z.string().uuid(),
});

export const listStudentsParamsSchema = z.object({
  businessUnitId: z.string().uuid(),
});
