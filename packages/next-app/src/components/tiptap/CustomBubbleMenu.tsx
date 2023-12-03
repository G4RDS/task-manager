import { BubbleMenu, Editor } from '@tiptap/react';
import { flex } from '../../../styled-system/patterns';

export const CustomBubbleMenu = ({ editor }: { editor: Editor }) => {
  return (
    <BubbleMenu
      editor={editor}
      className={flex({
        alignItems: 'stretch',
        height: '32px',
        backgroundColor: 'white',
        borderRadius: 6,
        boxShadow: 'md',
      })}
    >
      <button
        type="button"
        onClick={() => editor?.chain().focus().toggleBold().run()}
        data-active={editor?.isActive('bold') || undefined}
        className={flex({
          alignItems: 'center',
          px: 2,
          transition: '150ms token(easings.easeIn)',
          cursor: 'pointer',
          color: 'gray.700',
          fontWeight: 'bold',
          fontSize: '14px',
          _hover: {
            bg: 'gray.50',
          },
          _active: {
            color: 'primary.500',
          },
        })}
      >
        B
      </button>
    </BubbleMenu>
  );
};
