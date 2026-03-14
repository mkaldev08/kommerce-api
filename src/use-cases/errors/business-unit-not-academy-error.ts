export class BusinessUnitNotAcademyError extends Error {
  constructor() {
    super("Business unit is not an academy.");
  }
}
