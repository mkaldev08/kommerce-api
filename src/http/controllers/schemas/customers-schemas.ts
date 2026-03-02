import { z } from "zod";

export const createCustomerBodySchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phoneNumber: z.string().trim().optional().or(z.literal("")),
  nif: z.string().trim().optional().or(z.literal("")),
  municipalityId: z.string().uuid(),
  streetAddress: z.string().trim().optional().or(z.literal("")),
  postalCode: z.string().trim().optional().or(z.literal("")),
});

export const updateCustomerBodySchema = createCustomerBodySchema.partial();
