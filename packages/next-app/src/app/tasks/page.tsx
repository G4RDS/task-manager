import { css } from '../../../styled-system/css';
import { Header } from '../_components/Header/Header';
import { MainContents } from '../_components/MainContents/MainContents';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <>
      <Header titleEl={<h1>Tasks</h1>} />
      <MainContents
        className={css({
          p: 4,
        })}
      >
        Tasks
      </MainContents>
    </>
  );
}
