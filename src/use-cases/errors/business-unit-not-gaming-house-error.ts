export class BusinessUnitNotGamingHouseError extends Error {
  constructor() {
    super("A unidade de negocio nao e do tipo gaming house.");
  }
}
