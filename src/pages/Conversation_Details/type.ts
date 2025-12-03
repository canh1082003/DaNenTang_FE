export type SectionKey = "info" | "customize" | "media";
export interface AddMemberModalProps {
  conversationId: string;
  onClose: () => void;
  members: { _id: string }[];
}

export interface UserItem {
  _id: string;
  username: string;
  email: string;
  avatar: string;
}