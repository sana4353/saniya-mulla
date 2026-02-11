
export enum UserRole {
  ADMIN = 'ADMIN',
  FACULTY = 'FACULTY',
  STUDENT = 'STUDENT'
}

export type UserStatus = 'PENDING' | 'APPROVED' | 'BLOCKED';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
  avatar: string;
  department?: string;
  semester?: number;
  bio?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  type: 'URGENT' | 'INFO' | 'EVENT';
}

export interface MessageAttachment {
  name: string;
  type: string; 
  url: string;
  size?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date | string;
  isAI?: boolean;
  feedback?: 'positive' | 'negative' | null;
  attachment?: MessageAttachment;
}

export interface ChatThread {
  id: string;
  name: string;
  type: 'PRIVATE' | 'GROUP' | 'AI' | 'FACULTY_PRIVATE';
  participants: string[];
  lastMessage?: string;
  updatedAt?: string;
}

export interface UserSettings {
  disableAnimations: boolean;
  theme: 'default' | 'cyber' | 'emerald' | 'ocean' | 'forest';
}
