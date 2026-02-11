
import { UserRole, User, Notice, ChatThread } from './types';

// Fix: Added missing 'status' property to mock users as required by the User interface
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Dr. Rajesh Kumar', email: 'rajesh.k@college.edu', role: UserRole.FACULTY, avatar: 'https://picsum.photos/seed/rajesh/200', department: 'Computer Engineering', status: 'APPROVED' },
  { id: 'u2', name: 'Sneha Patil', email: 'sneha.p@student.edu', role: UserRole.STUDENT, avatar: 'https://picsum.photos/seed/sneha/200', semester: 4, status: 'APPROVED' },
  { id: 'u3', name: 'System Admin', email: 'admin@college.edu', role: UserRole.ADMIN, avatar: 'https://picsum.photos/seed/admin/200', status: 'APPROVED' },
  { id: 'u4', name: 'Prof. Amit Shah', email: 'amit.s@college.edu', role: UserRole.FACULTY, avatar: 'https://picsum.photos/seed/amit/200', department: 'Information Technology', status: 'APPROVED' },
];

// Fixed Notification type to Notice and updated mock data to be compatible with the Notice interface
export const MOCK_NOTIFICATIONS: Notice[] = [
  { id: 'n1', title: 'MSBTE Winter Exam Schedule', content: 'The tentative schedule for Winter 2024 exams is now released.', date: '2024-10-25', author: 'Admin Office', type: 'URGENT' },
  { id: 'n2', title: 'TechFest 2024', content: 'Join us for the annual technical festival starting next Monday.', date: '2024-10-20', author: 'Student Council', type: 'EVENT' },
];

export const MSBTE_SYSTEM_PROMPT = `
You are an AI assistant for a college following the MSBTE (Maharashtra State Board of Technical Education) curriculum.
Your primary audience are Students and Faculty.
Be helpful, professional, and knowledgeable about:
1. Diploma engineering subjects (Civil, Mechanical, Computer, IT, E&TC).
2. MSBTE Exam patterns, I-Scheme, K-Scheme syllabi.
3. General academic guidance and soft skills.
4. Multilingual support: You can answer in English, Hindi, and Marathi as requested.
5. Administrative tasks for Faculty (like formatting emails, scheduling advice).
If someone asks about generic GK, answer accurately.
Keep responses concise but informative.
`;