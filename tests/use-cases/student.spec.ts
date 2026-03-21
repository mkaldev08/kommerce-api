import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryBusinessUnitRepository } from "@/repositories/in-memory/in-memory-business-unit-repository";
import { InMemoryStudentsRepository } from "@/repositories/in-memory/in-memory-students-repository";
import { CreateStudentUseCase } from "@/use-cases/create-student-use-case";
import { DeleteStudentUseCase } from "@/use-cases/delete-student-use-case";
import { BusinessUnitNotAcademyError } from "@/use-cases/errors/business-unit-not-academy-error";
import { FindStudentByIdUseCase } from "@/use-cases/find-student-by-id-use-case";
import { ListStudentsUseCase } from "@/use-cases/list-students-use-case";
import { UpdateStudentUseCase } from "@/use-cases/update-student-use-case";

let businessUnitRepository: InMemoryBusinessUnitRepository;
let studentsRepository: InMemoryStudentsRepository;
let createStudentUseCase: CreateStudentUseCase;
let listStudentsUseCase: ListStudentsUseCase;
let findStudentByIdUseCase: FindStudentByIdUseCase;
let updateStudentUseCase: UpdateStudentUseCase;
let deleteStudentUseCase: DeleteStudentUseCase;
let academyBusinessUnitId: string;

describe("Student CRUD Use Cases", () => {
  beforeEach(async () => {
    businessUnitRepository = new InMemoryBusinessUnitRepository();
    studentsRepository = new InMemoryStudentsRepository();
    createStudentUseCase = new CreateStudentUseCase(
      studentsRepository,
      businessUnitRepository,
    );
    listStudentsUseCase = new ListStudentsUseCase(
      studentsRepository,
      businessUnitRepository,
    );
    findStudentByIdUseCase = new FindStudentByIdUseCase(
      studentsRepository,
      businessUnitRepository,
    );
    updateStudentUseCase = new UpdateStudentUseCase(
      studentsRepository,
      businessUnitRepository,
    );
    deleteStudentUseCase = new DeleteStudentUseCase(
      studentsRepository,
      businessUnitRepository,
    );

    const academy = await businessUnitRepository.create({
      name: "Academia Central",
      type: "ACADEMY",
      address: "Rua Principal",
      company_id: "company-id",
    });

    academyBusinessUnitId = academy.id;
  });

  it("should create, list, find, update and delete a student", async () => {
    const { student: createdStudent } = await createStudentUseCase.execute({
      name: "Maria Silva",
      email: "maria@example.com",
      phoneNumber: "923000111",
      guardianName: "Ana Silva",
      guardianPhoneNumber: "923000222",
      notes: "Turma de manha",
      businessUnitId: academyBusinessUnitId,
    });

    expect(createdStudent.id).toEqual(expect.any(String));
    expect(createdStudent.studentNumber).toMatch(/^[0-9]{4}-M-S-[0-9]{4}$/);

    const { students } = await listStudentsUseCase.execute({
      businessUnitId: academyBusinessUnitId,
    });

    expect(students).toHaveLength(1);

    const { student: foundStudent } = await findStudentByIdUseCase.execute({
      id: createdStudent.id,
      businessUnitId: academyBusinessUnitId,
    });

    expect(foundStudent.name).toBe("Maria Silva");
    expect(foundStudent.studentNumber).toBe(createdStudent.studentNumber);

    const { student: updatedStudent } = await updateStudentUseCase.execute({
      id: createdStudent.id,
      businessUnitId: academyBusinessUnitId,
      notes: "Turma da tarde",
    });

    expect(updatedStudent.notes).toBe("Turma da tarde");
    expect(updatedStudent.studentNumber).toBe(createdStudent.studentNumber);

    await deleteStudentUseCase.execute({
      id: createdStudent.id,
      businessUnitId: academyBusinessUnitId,
    });

    const { students: studentsAfterDelete } = await listStudentsUseCase.execute(
      {
        businessUnitId: academyBusinessUnitId,
      },
    );

    expect(studentsAfterDelete).toHaveLength(0);
  });

  it("should not allow student creation for a non-academy business unit", async () => {
    const store = await businessUnitRepository.create({
      name: "Loja",
      type: "STORE",
      address: "Rua Comercial",
      company_id: "company-id",
    });

    await expect(() =>
      createStudentUseCase.execute({
        name: "Pedro",
        businessUnitId: store.id,
      }),
    ).rejects.toBeInstanceOf(BusinessUnitNotAcademyError);
  });

  it("should generate unique student numbers", async () => {
    const { student: firstStudent } = await createStudentUseCase.execute({
      name: "Maria Silva",
      businessUnitId: academyBusinessUnitId,
    });

    const { student: secondStudent } = await createStudentUseCase.execute({
      name: "Maria Silva",
      businessUnitId: academyBusinessUnitId,
    });

    expect(firstStudent.studentNumber).not.toBe(secondStudent.studentNumber);
    expect(firstStudent.studentNumber).toMatch(/^[0-9]{4}-M-S-[0-9]{4}$/);
    expect(secondStudent.studentNumber).toMatch(/^[0-9]{4}-M-S-[0-9]{4}$/);
  });
});
