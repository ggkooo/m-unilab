import type { CreateTicketPayload, CreateTicketResponse } from '../domain/types';
import { buildApiUrl, getApiConfig, validateApiConfig } from './api-config';

export interface TicketClient {
  createTicket(payload: CreateTicketPayload): Promise<CreateTicketResponse>;
}

export class HttpTicketClient implements TicketClient {
  async createTicket(payload: CreateTicketPayload): Promise<CreateTicketResponse> {
    const config = getApiConfig();
    const issues = validateApiConfig(config);
    const endpoint = config.explicitTicketUrl ?? buildApiUrl(config.ticketsPath, config.baseUrl);

    if (issues.length > 0) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { printStatus: 'enviando' };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (config.apiKey) {
      headers['X-API-KEY'] = config.apiKey;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...payload,
        location: config.location ?? payload.location,
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (!response.ok) {
      let detail = '';

      try {
        const body = await response.json();
        detail = body?.message ?? body?.error ?? JSON.stringify(body);
      } catch {
        detail = await response.text().catch(() => '');
      }

      throw new Error(`Erro ${response.status}: ${detail || response.statusText}`);
    }

    return (await response.json()) as CreateTicketResponse;
  }
}

export const ticketClient = new HttpTicketClient();