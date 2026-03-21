import type {
  CreateStudentInput,
  StudentData,
  StudentsRepository,
} from "../students-repository";

export class InMemoryStudentsRepository implements StudentsRepository {
  private items: StudentData[] = [];

  async create(data: CreateStudentInput): Promise<StudentData> {
    const { firstName, lastName } = this.splitStudentName(data.name);
    const student: StudentData = {
      id: crypto.randomUUID(),
      studentNumber: this.generateUniqueStudentNumber(firstName, lastName),
      name: data.name,
      email: data.email || null,
      phoneNumber: data.phoneNumber || null,
      guardianName: data.guardianName || null,
      guardianPhoneNumber: data.guardianPhoneNumber || null,
      notes: data.notes || null,
      businessUnitId: data.businessUnitId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.push(student);

    return student;
  }

  async findById(id: string): Promise<StudentData | null> {
    return this.items.find((student) => student.id === id) ?? null;
  }

  async findManyByBusinessUnitId(
    businessUnitId: string,
  ): Promise<StudentData[]> {
    return this.items
      .filter((student) => student.businessUnitId === businessUnitId)
      .sort((left, right) => left.name.localeCompare(right.name));
  }

  async update(
    id: string,
    data: Partial<CreateStudentInput>,
  ): Promise<StudentData> {
    const studentIndex = this.items.findIndex((student) => student.id === id);
    const currentStudent = this.items[studentIndex];

    const updatedStudent: StudentData = {
      ...currentStudent,
      name: data.name ?? currentStudent.name,
      email: data.email !== undefined ? data.email : currentStudent.email,
      phoneNumber:
        data.phoneNumber !== undefined
          ? data.phoneNumber
          : currentStudent.phoneNumber,
      guardianName:
        data.guardianName !== undefined
          ? data.guardianName
          : currentStudent.guardianName,
      guardianPhoneNumber:
        data.guardianPhoneNumber !== undefined
          ? data.guardianPhoneNumber
          : currentStudent.guardianPhoneNumber,
      notes: data.notes !== undefined ? data.notes : currentStudent.notes,
      businessUnitId: data.businessUnitId ?? currentStudent.businessUnitId,
      updatedAt: new Date(),
    };

    this.items[studentIndex] = updatedStudent;

    return updatedStudent;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((student) => student.id !== id);
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

  private generateUniqueStudentNumber(
    firstName: string,
    lastName: string,
  ): string {
    const entryYear = new Date().getFullYear();
    const firstInitial = this.extractInitial(firstName);
    const surnameInitial = this.extractInitial(lastName);

    for (let attempt = 0; attempt < 20; attempt++) {
      const randomSuffix = this.generateFourDigitRandom();
      const candidate = `${entryYear}-${firstInitial}-${surnameInitial}-${randomSuffix}`;
      const exists = this.items.some(
        (student) => student.studentNumber === candidate,
      );

      if (!exists) {
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
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return String(randomSuffix);
  }
}
