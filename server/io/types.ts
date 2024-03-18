export interface PrivateMessage {
  to: string;
  from: string;
  message: string;
  conversation: string;
}

export enum IOEvents {
  PRIVATE_MESSAGE = "PRIVATE_MESSAGE",
  PUBLIC_MESSAGE = "PUBLC_MESSAGE",
}
