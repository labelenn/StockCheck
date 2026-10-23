import type { ExtraItem, ItemKey, Preset } from '../types';

export interface AppStateV2 {
  checked: Record<ItemKey, boolean>;
  extras: ExtraItem[];
  gotIt: Record<ItemKey, boolean>;
  categoryIndex: number;
  preset: Preset;
}

/** Shape of the old (pre-wizard) v1 state: a flat checked map, extras, and a preset. */
export interface AppStateV1 {
  checked: Record<ItemKey, boolean>;
  extras: { key: ItemKey; categoryId: string; name: string }[];
  preset: Preset;
}

/**
 * Migrates v1 state into the v2 shape. The v1 "Other" catch-all category no
 * longer exists (added items now always belong to a real category), so any
 * v1 extras filed under it are dropped rather than guessed into a category.
 */
export function migrateV1ToV2(v1: AppStateV1, initial: AppStateV2): AppStateV2 {
  return {
    checked: { ...v1.checked },
    extras: v1.extras.filter((extra) => extra.categoryId !== 'other'),
    gotIt: {},
    categoryIndex: initial.categoryIndex,
    preset: v1.preset ?? initial.preset,
  };
}

/**
 * Applied when saved v2 state has exceeded STATE_TTL_DAYS: discards ticks,
 * one-off extras, Got-it marks, and the wizard position, but keeps the
 * user's preset choice.
 */
export function applyV2Expiry(expired: AppStateV2, initial: AppStateV2): AppStateV2 {
  return { ...initial, preset: expired.preset };
}
