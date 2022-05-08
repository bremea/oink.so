import Link from 'next/link';
import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Nav from '@/components/nav';
import Seo from '@/components/Seo';
import Status from '@/components/status';

export default function HomePage() {
  const [username, setUsername] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    if (window.localStorage.getItem('token')) {
      getMyInfo();
    }
    getPosts();
  }, []);

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

  const getPosts = async () => {
    const req = await fetch('/api/posts');
    const res = await req.json();
    setPosts(res.posts);
  };

  return (
    <Layout>
      <Seo />

      <main>
        <section className='wavy'>
          <div className='layout min-h-screen flex-col'>
            <Nav username={username} />
            <div className='flex h-full w-full flex-wrap items-center justify-center'>
              {username ? (
                <Status username={username} status={status} edible={true} />
              ) : (
                <></>
              )}
              {posts.map((post: { username: string; status: string }, i) => {
                return (
                  <Status
                    key={i}
                    username={post.username}
                    status={post.status}
                    edible={false}
                  />
                );
              })}
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
