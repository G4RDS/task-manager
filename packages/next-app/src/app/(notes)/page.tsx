import { redirect } from 'next/navigation';
import { prisma } from 'database';
import { css } from '../../../styled-system/css';
import { flex } from '../../../styled-system/patterns';
import { PrimaryButton } from '../../components/PrimaryButton';

export default function Page() {
  const onSubmitCreateNote = async () => {
    'use server';
    const note = await prisma.note.create({
      data: {
        title: '',
      },
    });
    redirect(`/notes/${note.id}`);
  };

  return (
    <section
      className={css({
        w: '100%',
        p: 8,
      })}
    >
      <div
        className={flex({
          alignItems: 'center',
          justifyContent: 'space-between',
        })}
      >
        <h1
          className={css({
            fontSize: '24px',
            lineHeight: 1.2,
            fontWeight: 'bold',
          })}
        >
          Notes
        </h1>
        <form action={onSubmitCreateNote}>
          <PrimaryButton type="submit">作成</PrimaryButton>
        </form>
      </div>
      <div className={css({ mt: 4 })}></div>
    </section>
  );
}
