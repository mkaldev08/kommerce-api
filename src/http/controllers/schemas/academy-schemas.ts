import { z } from "zod";
import { PaymentMethod, PaymentType } from "generated/prisma/enums";

export const businessUnitParamsSchema = z.object({
  businessUnitId: z.string().uuid(),
});

export const idParamsSchema = businessUnitParamsSchema.extend({
  id: z.string().uuid(),
});

export const createBeltBodySchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().optional().or(z.literal("")),
});

export const createSchoolYearBodySchema = z.object({
  name: z.string().trim().min(2),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export const createInstructorBodySchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  phone: z.string().trim().optional().or(z.literal("")),
  beltId: z.string().uuid(),
});

export const createClassBodySchema = z.object({
  name: z.string().trim().min(2),
  schedule: z.string().trim().min(2),
  instructorId: z.string().uuid(),
  schoolYearId: z.string().uuid(),
});

export const listClassesQuerySchema = z.object({
  schoolYearId: z.string().uuid().optional(),
});

export const createEnrollmentBodySchema = z.object({
  studentId: z.string().uuid(),
  classId: z.string().uuid(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),
});

export const updateEnrollmentBodySchema = z.object({
  classId: z.string().uuid().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().nullable().optional(),
});

export const enrollmentPaymentBodySchema = z.object({
  cashRegisterId: z.string().uuid(),
  amount: z.number().positive(),
  method: z.nativeEnum(PaymentMethod),
  paymentType: z.nativeEnum(PaymentType),
  paidAt: z.coerce.date().optional(),
});
