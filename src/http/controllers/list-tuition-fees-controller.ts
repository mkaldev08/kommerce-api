import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@/lib/prisma";
import { handleControllerError } from "./helpers/handle-controller-error";
import { listTuitionFeesQuerySchema } from "./schemas/academy-schemas";

export async function ListTuitionFeesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const query = listTuitionFeesQuerySchema.parse(request.query);

    const tuitionFees = await prisma.tuitionFee.findMany({
      where: query.beltId ? { belt_id: query.beltId } : undefined,
      include: {
        belt: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{ belt_id: "asc" }, { created_at: "desc" }],
    });

    return reply.status(200).send({
      tuitionFees: tuitionFees.map((tuitionFee) => ({
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
      })),
    });
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
