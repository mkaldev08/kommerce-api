export class WorkShiftStillOpenError extends Error {
  constructor() {
    super('Work shift still open.')
  }
}
