/** Number of days saved state (check marks, extras, in-basket ticks) remains valid before being discarded. */
export const STATE_TTL_DAYS = 7;

/** localStorage key for app state. Bump the version suffix when the shape changes incompatibly. */
export const STORAGE_KEY = 'stockcheck:v1';

/** localStorage key for the user's light/dark/system theme preference. */
export const THEME_STORAGE_KEY = 'StockCheck-theme-preference';
