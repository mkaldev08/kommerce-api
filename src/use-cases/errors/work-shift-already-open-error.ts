export class WorkShiftAlreadyOpenError extends Error {
  constructor() {
    super('Work shift already open.')
  }
}
