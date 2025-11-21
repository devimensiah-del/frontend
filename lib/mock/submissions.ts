/**
 * Mock submission data for development
 */

import type { Submission } from '@/types';

export const mockSubmissions: Submission[] = [
  {
    id: 'submission-1',
    userId: 'user-2',
    status: 'completed',
    personalInfo: {
      fullName: 'João Silva',
      email: 'usuario@exemplo.com',
      phone: '(11) 98765-4321',
      document: '123.456.789-00',
    },
    address: {
      street: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
    },
    notes: 'Cliente solicitou análise completa de crédito',
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-20T15:45:00.000Z',
  },
  {
    id: 'submission-2',
    userId: 'user-2',
    status: 'processing',
    personalInfo: {
      fullName: 'João Silva',
      email: 'usuario@exemplo.com',
      phone: '(11) 98765-4321',
      document: '123.456.789-00',
    },
    address: {
      street: 'Av. Paulista, 1000',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
    },
    notes: 'Análise de investimento',
    createdAt: '2024-02-10T09:15:00.000Z',
    updatedAt: '2024-02-10T09:15:00.000Z',
  },
  {
    id: 'submission-3',
    userId: 'user-3',
    status: 'pending',
    personalInfo: {
      fullName: 'Maria Santos',
      email: 'maria@exemplo.com',
      phone: '(21) 91234-5678',
      document: '987.654.321-00',
    },
    address: {
      street: 'Rua da Praia, 456',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '20000-000',
    },
    notes: 'Primeira análise',
    createdAt: '2024-02-15T11:20:00.000Z',
    updatedAt: '2024-02-15T11:20:00.000Z',
  },
];
