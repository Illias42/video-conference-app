export type MessageType = "message" | "notification";

export type Message = {
  type: MessageType;
  userId?: string;
  userName?: string;
  avatar?: string;
  message: string;
  createdAt: Date;
}