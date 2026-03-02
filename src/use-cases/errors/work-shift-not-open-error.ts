export class WorkShiftNotOpenError extends Error {
  constructor() {
    super('Work shift is not open.')
  }
}
