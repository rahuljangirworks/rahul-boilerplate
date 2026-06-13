/**
 * Mock Data for the admin dashboard.
 *
 * Replace with real API calls when backend is ready.
 */

export interface MockUserRecord {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "inactive" | "invited";
  avatar: string;
  lastActive: string;
  createdAt: string;
}

export const mockUsers: MockUserRecord[] = [
  {
    id: "user_1",
    name: "Rahul",
    email: "rahul@example.com",
    role: "admin",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    lastActive: "2025-06-13T10:30:00Z",
    createdAt: "2025-01-15T00:00:00Z",
  },
  {
    id: "user_2",
    name: "Sarah Chen",
    email: "sarah@example.com",
    role: "admin",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    lastActive: "2025-06-12T14:20:00Z",
    createdAt: "2025-02-20T00:00:00Z",
  },
  {
    id: "user_3",
    name: "Marcus Johnson",
    email: "marcus@example.com",
    role: "user",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    lastActive: "2025-06-11T09:15:00Z",
    createdAt: "2025-03-10T00:00:00Z",
  },
  {
    id: "user_4",
    name: "Emily Rodriguez",
    email: "emily@example.com",
    role: "user",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    lastActive: "2025-06-10T16:45:00Z",
    createdAt: "2025-04-05T00:00:00Z",
  },
  {
    id: "user_5",
    name: "Alex Kim",
    email: "alex@example.com",
    role: "user",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    lastActive: "2025-06-09T11:00:00Z",
    createdAt: "2025-05-01T00:00:00Z",
  },
  {
    id: "user_6",
    name: "Jordan Lee",
    email: "jordan@example.com",
    role: "user",
    status: "invited",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
    lastActive: "2025-06-08T08:30:00Z",
    createdAt: "2025-05-15T00:00:00Z",
  },
  {
    id: "user_7",
    name: "Priya Patel",
    email: "priya@example.com",
    role: "user",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    lastActive: "2025-06-07T13:20:00Z",
    createdAt: "2025-05-20T00:00:00Z",
  },
  {
    id: "user_8",
    name: "Chris Taylor",
    email: "chris@example.com",
    role: "user",
    status: "inactive",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris",
    lastActive: "2025-06-01T10:00:00Z",
    createdAt: "2025-04-25T00:00:00Z",
  },
];

export const mockStats = {
  totalUsers: 8,
  activeUsers: 6,
  adminUsers: 2,
  invitedUsers: 1,
};
