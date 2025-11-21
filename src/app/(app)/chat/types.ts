export type ChatListItemData = { 
  id: string; 
  avatarSrc: string; 
  avatarAlt: string; 
  userName: string; 
  statusOrMessage: string; 
  timestamp: string; 
  showNotification?: boolean; 
};

export type MessageData = { 
  id: string; 
  senderName: string; 
  timestamp: string; 
  message: string; 
  isSender: boolean; 
  avatar?: React.ReactElement; 
  statusIcon?: React.ReactElement;
  image?: Buffer | string;
  audioUrl?: string;
  enableTTS?: boolean;
};

export type ChatHeaderData = { 
  userName: string; 
  userStatus: string; 
  avatarSrc: string; 
  avatarAlt?: string; 
  isOnline?: boolean; 
  onMoreOptionsClick?: () => void; 
  moreOptionsIcon?: React.ReactElement; 
  leftActionContent?: string; 
  onLeftActionClick?: () => void; 
};

type Role = "user" | "assistant";

export interface ChatTurn {
    role: Role; 
    content: string;
}
