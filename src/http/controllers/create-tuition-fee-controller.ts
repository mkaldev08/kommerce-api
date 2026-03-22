import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@/lib/prisma";
import { handleControllerError } from "./helpers/handle-controller-error";
import { createTuitionFeeBodySchema } from "./schemas/academy-schemas";

export async function CreateTuitionFeeController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const body = createTuitionFeeBodySchema.parse(request.body);

    const dueDate = new Date();
    dueDate.setDate(body.dueDay);
    dueDate.setHours(0, 0, 0, 0);

    const tuitionFee = await prisma.tuitionFee.create({
      data: {
        amount: body.fee,
        due_date: dueDate,
        paid: false,
        belt_id: body.beltId,
        fee: body.fee,
        enrollment_fee: body.enrollmentFee,
        confirmation_fee: body.confirmationFee,
        fine_tax: body.fineTax ?? 0,
      },
      include: {
        belt: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return reply.status(201).send({
      tuitionFee: {
        id: tuitionFee.id,
        beltId: tuitionFee.belt_id,
        beltName: tuitionFee.belt.name,
        fee: Number(tuitionFee.fee),
        enrollmentFee: Number(tuitionFee.enrollment_fee),
        confirmationFee: Number(tuitionFee.confirmation_fee),
        fineTax: Number(tuitionFee.fine_tax ?? 0),
        dueDay: tuitionFee.due_date.getDate(),
        createdAt: tuitionFee.created_at,
        updatedAt: tuitionFee.updated_at,
      },
    });
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
