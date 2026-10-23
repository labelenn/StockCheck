import { describe, expect, it } from 'vitest';
import { applyV2Expiry, migrateV1ToV2 } from './migrateState';
import type { AppStateV1, AppStateV2 } from './migrateState';

const initial: AppStateV2 = {
  checked: {},
  extras: [],
  gotIt: {},
  categoryIndex: 0,
  preset: 'notes',
};

describe('migrateV1ToV2', () => {
  it('carries over checked marks and preset', () => {
    const v1: AppStateV1 = {
      checked: { 'pantry::Rice': true },
      extras: [],
      preset: 'markdown',
    };
    const result = migrateV1ToV2(v1, initial);
    expect(result.checked).toEqual({ 'pantry::Rice': true });
    expect(result.preset).toBe('markdown');
    expect(result.categoryIndex).toBe(0);
    expect(result.gotIt).toEqual({});
  });

  it('carries over extras filed under a real category', () => {
    const v1: AppStateV1 = {
      checked: {},
      extras: [{ key: 'pantry::Honey', categoryId: 'pantry', name: 'Honey' }],
      preset: 'notes',
    };
    const result = migrateV1ToV2(v1, initial);
    expect(result.extras).toEqual([{ key: 'pantry::Honey', categoryId: 'pantry', name: 'Honey' }]);
  });

  it('drops extras filed under the removed "other" catch-all category', () => {
    const v1: AppStateV1 = {
      checked: {},
      extras: [{ key: 'other::Something', categoryId: 'other', name: 'Something' }],
      preset: 'notes',
    };
    const result = migrateV1ToV2(v1, initial);
    expect(result.extras).toEqual([]);
  });
});

describe('applyV2Expiry', () => {
  it('resets ticks, extras, gotIt, and category position but keeps the preset', () => {
    const expired: AppStateV2 = {
      checked: { 'pantry::Rice': true },
      extras: [{ key: 'pantry::Honey', categoryId: 'pantry', name: 'Honey' }],
      gotIt: { 'pantry::Rice': true },
      categoryIndex: 4,
      preset: 'markdown',
    };
    const result = applyV2Expiry(expired, initial);
    expect(result).toEqual({ ...initial, preset: 'markdown' });
  });
});
