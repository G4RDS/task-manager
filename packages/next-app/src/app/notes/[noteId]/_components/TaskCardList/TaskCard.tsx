'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { Task } from 'database/src/utils/prisma';
import { css } from '../../../../../../styled-system/css';
import { token } from '../../../../../../styled-system/tokens';

const COLLAPSED_HEIGHT = 384;
const COLLAPSED_OFFSET = 64;

interface Props {
  task: Pick<Task, 'id' | 'title' | 'status' | 'contentHtml'>;
}
export const TaskCard = ({ task }: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [canCollapse, setCanCollapse] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const contentHeight = useRef<number>(0);

  useLayoutEffect(() => {
    if (!contentRef.current) return;

    const el = contentRef.current;
    contentHeight.current = el.offsetHeight;
    if (el.offsetHeight > COLLAPSED_HEIGHT + COLLAPSED_OFFSET) {
      setCanCollapse(true);
      setIsCollapsed(true);
    }
  }, []);

  return (
    <article
      className={css({
        p: 3,
        border: '1px solid token(colors.gray.100)',
        borderRadius: '14px',
        bgColor: '#fff',
        boxShadow: 'md',
        color: 'gray.700',
      })}
    >
      {task.status === 'TODO' ? (
        <p
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            width: 'auto',
            height: 6,
            px: 2,
            backgroundColor: 'gray.200',
            borderRadius: '6px',
            color: 'gray.600',
            fontSize: '12px',
            fontWeight: 600,
          })}
        >
          TO-DO
        </p>
      ) : (
        <p>not implemented</p>
      )}
      <h1
        className={css({
          mt: 2,
          mb: 1,
          ml: '2px',
          color: 'gray.900',
          fontSize: '1.25rem',
          lineHeight: 1.3,
          fontWeight: 600,
        })}
      >
        {task.title}
      </h1>
      {task.contentHtml && (
        <>
          <div
            ref={contentRef}
            dangerouslySetInnerHTML={{ __html: task.contentHtml }}
            data-collapsed={canCollapse && isCollapsed}
            className={css({
              position: 'relative',
              minHeight: 0,
              mt: 4,
              overflow: 'hidden',
              fontSize: '0.9375rem',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 'auto 0 0 0',
                opacity: 0,
                transition: 'opacity 1s token(easings.easeOut)',
                height: 16,
                background: `linear-gradient(
                  to top,
                  hsl(0, 0%, 100%) 0%,
                  hsla(0, 0%, 100%, 0.738) 19%,
                  hsla(0, 0%, 100%, 0.541) 34%,
                  hsla(0, 0%, 100%, 0.382) 47%,
                  hsla(0, 0%, 100%, 0.278) 56.5%,
                  hsla(0, 0%, 100%, 0.194) 65%,
                  hsla(0, 0%, 100%, 0.126) 73%,
                  hsla(0, 0%, 100%, 0.075) 80.2%,
                  hsla(0, 0%, 100%, 0.042) 86.1%,
                  hsla(0, 0%, 100%, 0.021) 91%,
                  hsla(0, 0%, 100%, 0.008) 95.2%,
                  hsla(0, 0%, 100%, 0.002) 98.2%,
                  hsla(0, 0%, 100%, 0) 100%
                )`,
              },
              '&[data-collapsed="true"]': {
                maxHeight: `${COLLAPSED_HEIGHT}px`,
                '&::after': {
                  opacity: 1,
                },
              },
              '& > *:first-child': {
                mt: 0,
              },
              '& p': {
                my: '1px',
                py: '1px',
              },
              '& h2': {
                mt: '1rem',
                mb: '4px',
                py: '1px',
                fontSize: '1.125rem',
                lineHeight: 1.3,
                fontWeight: 600,
              },
              '& h3': {
                mt: '0.7rem',
                mb: '1px',
                py: '1px',
                fontSize: '1.0625rem',
                lineHeight: 1.3,
                fontWeight: 600,
              },
              '& h4': {
                mt: '0.5rem',
                mb: '1px',
                py: '1px',
                fontSize: '1rem',
                lineHeight: 1.3,
                fontWeight: 600,
              },
              '& ul li': {
                position: 'relative',
                my: '1px',
                pl: '1.625rem',
                _before: {
                  content: '"•"',
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  w: '1.625rem',
                  py: '1px',
                  textAlign: 'center',
                  fontFamily: 'Arial',
                  fontSize: '1.5rem',
                  lineHeight: '1.5rem',
                },
              },
            })}
          />
          {canCollapse && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsCollapsed((prev) => !prev);

                const keyframes = [
                  { maxHeight: `${COLLAPSED_HEIGHT}px` },
                  { maxHeight: `${contentHeight.current}px` },
                ];

                contentRef.current?.animate(
                  isCollapsed ? keyframes : keyframes.reverse(),
                  {
                    duration: 150,
                    easing: token('easings.easeOut'),
                  },
                );
              }}
              className={css({
                w: '100%',
                mt: 4,
                py: 1,
                borderRadius: '99px',
                color: 'gray.500',
                fontSize: '0.875rem',
                fontWeight: 600,
                transition: '150ms token(easings.easeOut)',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'gray.100',
                },
              })}
            >
              {isCollapsed ? 'See more' : 'See less'}
            </button>
          )}
        </>
      )}
    </article>
  );
};
