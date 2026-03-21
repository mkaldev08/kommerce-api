import { prisma } from "@/lib/prisma";
import type {
  CreateStudentInput,
  StudentData,
  StudentsRepository,
} from "../students-repository";
import { Prisma, type Student } from "../../../generated/prisma/client";

export class PrismaStudentsRepository implements StudentsRepository {
  async create(data: CreateStudentInput): Promise<StudentData> {
    const { firstName, lastName } = this.splitStudentName(data.name);
    const maxAttempts = 20;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const studentNumber = await this.generateUniqueStudentNumber(
        firstName,
        lastName,
      );

      try {
        const student = await prisma.student.create({
          data: {
            first_name: firstName,
            last_name: lastName,
            student_number: studentNumber,
            email: data.email || null,
            phone: data.phoneNumber || null,
            guardian_name: data.guardianName || null,
            guardian_phone_number: data.guardianPhoneNumber || null,
            notes: data.notes || null,
            business_unit_id: data.businessUnitId,
          },
        });

        return this.toStudentData(student);
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002" &&
          this.isStudentNumberUniqueConflict(error)
        ) {
          continue;
        }

        throw error;
      }
    }

    throw new Error("Could not generate unique student number");
  }

  async findById(id: string): Promise<StudentData | null> {
    const student = await prisma.student.findUnique({
      where: { id },
    });

    return student ? this.toStudentData(student) : null;
  }

  async findManyByBusinessUnitId(
    businessUnitId: string,
  ): Promise<StudentData[]> {
    const students = await prisma.student.findMany({
      where: { business_unit_id: businessUnitId },
      orderBy: [{ first_name: "asc" }, { last_name: "asc" }],
    });

    return students.map((student) => this.toStudentData(student));
  }

  async update(
    id: string,
    data: Partial<CreateStudentInput>,
  ): Promise<StudentData> {
    const splitName = data.name ? this.splitStudentName(data.name) : null;

    const student = await prisma.student.update({
      where: { id },
      data: {
        first_name: splitName?.firstName,
        last_name: splitName?.lastName,
        email: data.email !== undefined ? data.email : undefined,
        phone: data.phoneNumber !== undefined ? data.phoneNumber : undefined,
        guardian_name:
          data.guardianName !== undefined ? data.guardianName : undefined,
        guardian_phone_number:
          data.guardianPhoneNumber !== undefined
            ? data.guardianPhoneNumber
            : undefined,
        notes: data.notes !== undefined ? data.notes : undefined,
        business_unit_id:
          data.businessUnitId !== undefined ? data.businessUnitId : undefined,
      },
    });

    return this.toStudentData(student);
  }

  async delete(id: string): Promise<void> {
    await prisma.student.delete({
      where: { id },
    });
  }

  private toStudentData(student: Student): StudentData {
    return {
      id: student.id,
      studentNumber: student.student_number,
      name: this.combineStudentName(student.first_name, student.last_name),
      email: student.email,
      phoneNumber: student.phone,
      guardianName: student.guardian_name,
      guardianPhoneNumber: student.guardian_phone_number,
      notes: student.notes,
      businessUnitId: student.business_unit_id,
      createdAt: student.created_at,
      updatedAt: student.updated_at,
    };
  }

  private splitStudentName(name: string): {
    firstName: string;
    lastName: string;
  } {
    const normalizedName = name.trim().replace(/\s+/g, " ");
    const [firstName, ...lastNameParts] = normalizedName.split(" ");

    return {
      firstName,
      lastName: lastNameParts.join(" ") || firstName,
    };
  }

  private combineStudentName(firstName: string, lastName: string): string {
    if (lastName === firstName) {
      return firstName;
    }

    return `${firstName} ${lastName}`;
  }

  private async generateUniqueStudentNumber(
    firstName: string,
    lastName: string,
  ): Promise<string> {
    const entryYear = new Date().getFullYear();
    const firstInitial = this.extractInitial(firstName);
    const surnameInitial = this.extractInitial(lastName);
    const maxAttempts = 20;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const randomSuffix = this.generateFourDigitRandom();
      const candidate = `${entryYear}-${firstInitial}-${surnameInitial}-${randomSuffix}`;
      const existing = await prisma.student.findUnique({
        where: { student_number: candidate },
        select: { id: true },
      });

      if (!existing) {
        return candidate;
      }
    }

    throw new Error("Could not generate unique student number");
  }

  private extractInitial(value: string): string {
    const normalized = value.trim();
    const firstCharacter = normalized.charAt(0).toUpperCase();

    return firstCharacter || "X";
  }

  private generateFourDigitRandom(): string {
    return String(Math.floor(1000 + Math.random() * 9000));
  }

  private isStudentNumberUniqueConflict(
    error: Prisma.PrismaClientKnownRequestError,
  ): boolean {
    const target = error.meta?.target;

    if (Array.isArray(target)) {
      return target.includes("student_number");
    }

    return String(target ?? "").includes("student_number");
  }
}
