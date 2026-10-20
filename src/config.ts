/** Number of days saved state (check marks, extras, in-basket ticks) remains valid before being discarded. */
export const STATE_TTL_DAYS = 7;

/** localStorage key for app state. Bump the version suffix when the shape changes incompatibly. */
export const STORAGE_KEY = 'stockcheck:v1';

/** Deep links (wa.me, t.me) get unreliable beyond this length; fall back to Share/Copy. */
export const DEEP_LINK_MAX_CHARS = 1800;
