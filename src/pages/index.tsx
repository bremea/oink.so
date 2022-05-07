import Link from 'next/link';
import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import Status from '@/components/status';

export default function HomePage() {
  const [username, setUsername] = React.useState('');
  const [status, setStatus] = React.useState('');

  React.useEffect(() => {
    if (window.localStorage.getItem('token')) {
      getMyInfo();
    }
  });

  const getMyInfo = async () => {
    const req = await fetch('/api/me', {
      headers: {
        Authorization: window.localStorage.getItem('token') as string,
      },
    });
    const res = await req.json();
    if (!res.error) {
      setUsername(res.username);
      setStatus(res.status);
    }
  };

  return (
    <Layout>
      <Seo />

      <main>
        <section className='wavy'>
          <div className='layout flex min-h-screen'>
            <div className='flex'>
              {username ? (
                <Status username={username} status={status} edible={true} />
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
