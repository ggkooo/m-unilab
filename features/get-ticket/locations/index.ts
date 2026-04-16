export const DEFAULT_CAMPUS_LOCATION = 'campus';

const ALLOWED_LOCATIONS = [
  DEFAULT_CAMPUS_LOCATION,
  'centro',
] as const;

type AllowedLocation = (typeof ALLOWED_LOCATIONS)[number];

const LOCATION_SET = new Set<string>(ALLOWED_LOCATIONS);

export function normalizeLocation(value?: string | string[] | null): AllowedLocation | null {
  if (!value) {
    return null;
  }

  const rawValue = Array.isArray(value) ? value[0] : value;

  if (!rawValue) {
    return null;
  }

  const normalized = rawValue.trim().toLowerCase();

  if (!LOCATION_SET.has(normalized)) {
    return null;
  }

  return normalized as AllowedLocation;
}
