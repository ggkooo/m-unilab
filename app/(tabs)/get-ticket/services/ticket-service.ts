import type { CreateTicketPayload, CreateTicketResponse } from '../types';
import { apiConfig, buildApiUrl } from './api-config';

export async function createTicket(payload: CreateTicketPayload): Promise<CreateTicketResponse> {
  const explicitEndpoint = process.env.EXPO_PUBLIC_TICKET_API_URL;
  const endpoint = explicitEndpoint || buildApiUrl(apiConfig.ticketsPath);

  if (!explicitEndpoint && !process.env.EXPO_PUBLIC_API_BASE_URL) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { printStatus: 'enviando' };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeoutMs);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiConfig.apiKey) {
    headers['X-API-KEY'] = apiConfig.apiKey;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    signal: controller.signal,
  }).finally(() => clearTimeout(timeoutId));

  if (!response.ok) {
    throw new Error('Falha de comunicacao com a API.');
  }

  return (await response.json()) as CreateTicketResponse;
}
