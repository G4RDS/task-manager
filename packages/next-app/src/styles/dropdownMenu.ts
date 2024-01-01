import { css } from '../../styled-system/css';

export const dropdownMenuContentStyle = css({
  minW: 48,
  p: 1,
  border: '1px solid token(colors.gray.100)',
  borderRadius: '10px',
  boxShadow: 'md',
  background: '#fff',
  userSelect: 'none',
  transformOrigin: 'var(--radix-dropdown-menu-content-transform-origin)',
  animation: 'popIn 150ms token(easings.easeOut)',
  '& > div[data-radix-collection-item]': {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    py: 2,
    px: 2,
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    '& svg': {
      w: 4,
      h: 4,
      color: 'gray.500',
    },
    '&[data-highlighted]': {
      background: 'gray.100',
      outline: 'none',
    },
  },
});
