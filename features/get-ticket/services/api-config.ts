const DEFAULT_BASE_URL = '';
const DEFAULT_TICKETS_PATH = '/api/tickets';
const DEFAULT_TIMEOUT_MS = 10000;

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, '');
const normalizePath = (path: string) => (path.startsWith('/') ? path : `/${path}`);

const getOptionalEnvValue = (value?: string) => {
  const normalized = value?.trim();
  return normalized ? normalized : null;
};

const getTimeout = (value?: string) => {
  const parsed = Number(value ?? DEFAULT_TIMEOUT_MS);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TIMEOUT_MS;
};

export type ApiConfig = {
  baseUrl: string | null;
  ticketsPath: string;
  apiKey: string | null;
  timeoutMs: number;
  explicitTicketUrl: string | null;
};

export function getApiConfig(): ApiConfig {
  const baseUrl = getOptionalEnvValue(process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_BASE_URL);

  return {
    baseUrl: baseUrl ? normalizeBaseUrl(baseUrl) : null,
    ticketsPath: normalizePath(process.env.EXPO_PUBLIC_API_TICKETS_PATH ?? DEFAULT_TICKETS_PATH),
    apiKey: getOptionalEnvValue(process.env.EXPO_PUBLIC_API_KEY),
    timeoutMs: getTimeout(process.env.EXPO_PUBLIC_API_TIMEOUT_MS),
    explicitTicketUrl: getOptionalEnvValue(process.env.EXPO_PUBLIC_TICKET_API_URL),
  };
}

export function validateApiConfig(config: ApiConfig): string[] {
  const issues: string[] = [];

  if (!config.explicitTicketUrl && !config.baseUrl) {
    issues.push('EXPO_PUBLIC_API_BASE_URL nao configurada. Usando resposta simulada.');
  }

  return issues;
}

export function buildApiUrl(path: string, baseUrl?: string | null) {
  if (!baseUrl) {
    throw new Error('Base URL da API nao configurada.');
  }

  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const normalizedPath = normalizePath(path);

  if (normalizedBaseUrl.endsWith('/api') && normalizedPath.startsWith('/api/')) {
    return `${normalizedBaseUrl}${normalizedPath.slice(4)}`;
  }

  return `${normalizedBaseUrl}${normalizedPath}`;
};
