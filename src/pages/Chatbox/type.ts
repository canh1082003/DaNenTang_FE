export interface UserSummary {
  _id: string;
  username?: string;
  avatar?: string;
  isOnline?: boolean;
  role:string;
}

export interface Message {
  _id: string;
  conversation: string;
  sender: UserSummary;
  content: string;
  type?: "text" | "image" | "file";
  createdAt: string | Date;
  updatedAt?: string | Date;
  readBy?: string[];
  read?: boolean;
  fileName?: string;
}

export interface Conversation {
  _id: string;
  name?: string;
  avatar?: string;
  type?: "private" | "group";
  participants: UserSummary[];
  lastMessage?: {
    content: string;
    createdAt: string | Date;
    sender: string | UserSummary;
  };
  createdAt?: Date | string;
  updatedAt?: Date | string;
  timestamp?: string | Date;
  unreadCount?: number;
  online?: boolean;
  messages?: Message[];
  onlineParticipants?: string[];
  assignedDepartment?: string;
}
