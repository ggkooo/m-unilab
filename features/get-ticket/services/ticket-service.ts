import type { CreateTicketPayload, CreateTicketResponse } from '../domain/types';
import { ticketClient } from './ticket-client';

export async function createTicket(payload: CreateTicketPayload): Promise<CreateTicketResponse> {
  return ticketClient.createTicket(payload);
}
