import { apiFetch } from './base';
import { Submission } from '@/types';

export async function createCheckoutSession(submissionId: string) {
  return apiFetch<{ checkout_url: string }>(
    `/api/v1/payments/checkout/${submissionId}`,
    {
      method: 'POST',
    }
  );
}

export async function verifyPayment(sessionId: string) {
  return apiFetch<{ submission: Submission }>(
    `/api/v1/payments/verify/${sessionId}`,
    {
      method: 'GET',
    }
  );
}
