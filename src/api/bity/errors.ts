export class NotConnectedClientRequestError extends Error {
  public constructor() {
    super('Could not make requests when client is not connected.');
  }
}
