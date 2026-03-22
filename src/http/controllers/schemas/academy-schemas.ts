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

export const listTuitionFeesQuerySchema = z.object({
  beltId: z.string().uuid().optional(),
});

export const listEnrollmentFinancialPlansQuerySchema = z.object({
  schoolYearId: z.string().uuid().optional(),
  status: z.enum(["PENDING", "PAID", "OVERDUE", "ALL"]).optional(),
});

export const listRecentEnrollmentPaymentsQuerySchema = z.object({
  search: z.string().trim().min(2).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const createTuitionFeeBodySchema = z.object({
  beltId: z.string().uuid(),
  fee: z.number().positive(),
  enrollmentFee: z.number().positive(),
  confirmationFee: z.number().positive(),
  fineTax: z.number().min(0).max(100).optional(),
  dueDay: z.number().int().min(1).max(28),
});

export const createEnrollmentBodySchema = z.object({
  studentId: z.string().uuid(),
  classId: z.string().uuid(),
  beltId: z.string().uuid(),
});

export const updateEnrollmentBodySchema = z.object({
  classId: z.string().uuid().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().nullable().optional(),
});

export const enrollmentPaymentBodySchema = z.object({
  cashRegisterId: z.string().uuid(),
  amount: z.number().positive().optional(),
  method: z.nativeEnum(PaymentMethod),
  paymentType: z.nativeEnum(PaymentType),
  paidAt: z.coerce.date().optional(),
});
