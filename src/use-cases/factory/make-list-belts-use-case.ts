import { PrismaBeltsRepository } from "@/repositories/prisma/prisma-belts-repository";
import { ListBeltsUseCase } from "../list-belts-use-case";

export function makeListBeltsUseCase(): ListBeltsUseCase {
  return new ListBeltsUseCase(new PrismaBeltsRepository());
}
