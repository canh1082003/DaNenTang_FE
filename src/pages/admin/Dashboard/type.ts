export interface Conversations {
  totalConversations: number;
  activePlatforms: number;
  messagesToday: number;
  responseRate: string;
}
export interface IParticipant {
  _id: string;
  username: string;
  avatar: string;
}

export interface ILastMessage {
  _id: string;
  conversation: string;
  sender: string;
  content: string;
  type: "text" | "file" | "image" | "video";
  fileName?: string | null;
  readBy: string[];
  deletedBy: string[];
  isDeletedForEveryone: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IConversation {
  _id: string;
  type: "group" | "private";
  name: string;
  participants: IParticipant[];
  deletedBy: string[];
  createdAt: string;
  updatedAt: string;
  assignedDepartment?: string;
  leader?: string;
  lastReads?: Record<string, string>; // userId -> lastReadAt
  lastMessage?: ILastMessage;
}

export interface IRecentConversationsResponse {
  httpStatusCode: number;
  data: IConversation[];
}
export interface IPlatform {
  _id: string;
  _doc: {
    name: "Facebook" | "WhatsApp" | "Instagram" | "Telegram" | "Twitter";
    status: "connected" | "disconnected";
  };
  connectedAt?: string;
  disconnectedAt?: string;
  lastSync?: string;
}
