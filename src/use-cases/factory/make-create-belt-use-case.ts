import { PrismaBeltsRepository } from "@/repositories/prisma/prisma-belts-repository";
import { CreateBeltUseCase } from "../create-belt-use-case";

export function makeCreateBeltUseCase(): CreateBeltUseCase {
  return new CreateBeltUseCase(new PrismaBeltsRepository());
}
