import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Nav from '@/components/nav';
import Seo from '@/components/Seo';
import Status from '@/components/status';

export default function User() {
  const [myUsername, setMyUsername] = React.useState('');
  const [status, setStatus] = React.useState('');
  const router = useRouter();

  const username = router.query.username as string;

  const getUserInfo = React.useCallback(async () => {
    const req = await fetch(`/api/users/${username}`);
    const res = await req.json();
    setStatus(res.status);
  }, [username]);

  const getMyInfo = async () => {
    const req = await fetch('/api/me', {
      headers: {
        Authorization: window.localStorage.getItem('token') as string,
      },
    });
    const res = await req.json();
    if (!res.error) {
      setMyUsername(res.username);
    }
  };

  React.useEffect(() => {
    getUserInfo();
    if (window.localStorage.getItem('token')) {
      getMyInfo();
    }
  }, [getUserInfo]);

  return (
    <Layout>
      <Seo />

      <main>
        <section className='wavy'>
          <div className='layout flex min-h-screen flex-col'>
            <Nav username={myUsername} />
            <div className='flex h-full w-full items-center justify-center'>
              {username ? (
                <Status username={username} status={status} edible={false} />
              ) : (
                <></>
              )}
            </div>
            <footer className='absolute bottom-2 w-full text-center'>
              made with ❤️ by{' '}
              <Link href='/brett' passHref>
                <a className='link'>@brett</a>
              </Link>
            </footer>
          </div>
        </section>
      </main>
    </Layout>
  );
}
