export interface IUser {
  _id: string;
  username: string;
  avatar: string;
}

export interface IMessage {
  _id: string;
  content: string;
  createdAt: string;
}

export interface IConversation {
  _id: string;
  participants: IUser[];
  lastMessage?: IMessage;
  updatedAt: string;
  totalMessages?: number;
}