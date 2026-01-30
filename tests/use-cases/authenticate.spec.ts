import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.js";
import { AuthenticateUseCase } from "@/use-cases/authenticate";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });
  it("Should be able to authenticate", async () => {
    usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
      phone_number: "933808187",
      username: "johndoe",
    });

    const { user } = await sut.execute({
      username: "johndoe",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("Should not be able to authenticate with wrong username", async () => {
    await expect(() =>
      sut.execute({
        username: "wrongusername",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("Should not be able to authenticate with wrong password", async () => {
    usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
      phone_number: "933808187",
      username: "johndoe",
    });

    await expect(() =>
      sut.execute({
        username: "johndoe",
        password: "12345634",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
