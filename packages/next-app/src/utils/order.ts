import { generateKeyBetween as _generateKeyBetween } from 'fractional-indexing';

export const generateKeyBetween = (
  a: string | undefined,
  b: string | undefined,
) => {
  return _generateKeyBetween(a ?? 'a0', b);
};
