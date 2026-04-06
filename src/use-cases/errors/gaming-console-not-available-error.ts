export class GamingConsoleNotAvailableError extends Error {
  constructor() {
    super("A consola nao esta disponivel para iniciar sessao.");
  }
}
