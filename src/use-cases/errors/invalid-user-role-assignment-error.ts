export class InvalidUserRoleAssignmentError extends Error {
  constructor(
    message = 'Invalid role assignment for the selected business unit.',
  ) {
    super(message)
  }
}
