/** Number of days saved weekly state (check marks, one-off extras, Got-it marks, wizard position) remains valid before being discarded. */
export const STATE_TTL_DAYS = 7;

/** localStorage key for this week's app state. Bump the version suffix when the shape changes incompatibly. */
export const STORAGE_KEY = 'stockcheck:v2';

/** Previous storage key — read once on load for a best-effort migration into STORAGE_KEY, then cleared. */
export const LEGACY_STORAGE_KEY_V1 = 'stockcheck:v1';

/** localStorage key for the user's light/dark/system theme preference. */
export const THEME_STORAGE_KEY = 'StockCheck-theme-preference';
