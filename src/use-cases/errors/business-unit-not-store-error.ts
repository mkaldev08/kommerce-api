export class BusinessUnitNotStoreError extends Error {
  constructor() {
    super('Business unit is not a store.')
  }
}
