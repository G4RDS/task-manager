import { css, cx } from '../../../../styled-system/css';

interface Props {
  className?: string;
}
export const TodoIcon = ({ className }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx(css({ color: 'gray.400' }), className)}
    >
      <circle cx="12" cy="12" r="10"></circle>
    </svg>
  );
};
