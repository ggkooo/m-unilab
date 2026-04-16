const DEFAULT_BASE_URL = '/api';
const DEFAULT_TICKETS_PATH = '/tickets';
const DEFAULT_TIMEOUT_MS = 10000;

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, '');
const normalizePath = (path: string) => (path.startsWith('/') ? path : `/${path}`);

export const apiConfig = {
  baseUrl: normalizeBaseUrl(process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_BASE_URL),
  ticketsPath: normalizePath(process.env.EXPO_PUBLIC_API_TICKETS_PATH ?? DEFAULT_TICKETS_PATH),
  apiKey: process.env.EXPO_PUBLIC_API_KEY ?? '',
  timeoutMs: Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS),
};

export const buildApiUrl = (path: string) => `${apiConfig.baseUrl}${normalizePath(path)}`;
