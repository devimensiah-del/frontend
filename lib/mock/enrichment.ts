/**
 * Mock enrichment data for development
 */

import type { EnrichmentData } from '@/types';

export const mockEnrichment: EnrichmentData[] = [
  {
    id: 'enrichment-1',
    submissionId: 'submission-1',
    status: 'approved',
    data: {
      fullName: 'João Silva',
      cpf: '123.456.789-00',
      birthDate: '1985-05-15',
      motherName: 'Ana Silva',
      addresses: [
        {
          street: 'Rua das Flores, 123',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          type: 'residential',
        },
      ],
      phones: [
        {
          number: '(11) 98765-4321',
          type: 'mobile',
        },
      ],
      emails: [
        {
          email: 'usuario@exemplo.com',
          verified: true,
        },
      ],
      financialInfo: {
        creditScore: 750,
        monthlyIncome: 8500,
        employmentStatus: 'employed',
      },
    },
    sources: ['Serasa', 'Receita Federal', 'DETRAN'],
    confidence: 0.95,
    verifiedAt: '2024-01-18T10:30:00.000Z',
    createdAt: '2024-01-16T08:20:00.000Z',
    updatedAt: '2024-01-18T10:30:00.000Z',
  },
  {
    id: 'enrichment-2',
    submissionId: 'submission-2',
    status: 'pending',
    data: {
      fullName: 'João Silva',
      cpf: '123.456.789-00',
      birthDate: '1985-05-15',
      addresses: [
        {
          street: 'Av. Paulista, 1000',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01310-100',
          type: 'commercial',
        },
      ],
    },
    sources: ['Serasa'],
    confidence: 0.82,
    createdAt: '2024-02-10T09:20:00.000Z',
    updatedAt: '2024-02-10T09:20:00.000Z',
  },
  {
    id: 'enrichment-3',
    submissionId: 'submission-3',
    status: 'pending',
    data: {
      fullName: 'Maria Santos',
      cpf: '987.654.321-00',
      birthDate: '1990-08-20',
    },
    sources: [],
    confidence: 0.65,
    createdAt: '2024-02-15T11:30:00.000Z',
    updatedAt: '2024-02-15T11:30:00.000Z',
  },
];
