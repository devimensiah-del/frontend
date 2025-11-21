/**
 * Mock user data for development
 */

import type { User } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@imensiah.com',
    name: 'Admin Imensiah',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'user-2',
    email: 'usuario@exemplo.com',
    name: 'João Silva',
    role: 'user',
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
  },
  {
    id: 'user-3',
    email: 'maria@exemplo.com',
    name: 'Maria Santos',
    role: 'user',
    createdAt: '2024-02-01T14:20:00.000Z',
    updatedAt: '2024-02-01T14:20:00.000Z',
  },
];
