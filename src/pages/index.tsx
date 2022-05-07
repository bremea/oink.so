import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

export default function HomePage() {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <section>
          <div className='layout flex min-h-screen flex-col items-center justify-center text-center'>
            <footer className='absolute bottom-2'>
              made with ❤️ by @bremea
            </footer>
          </div>
        </section>
      </main>
    </Layout>
  );
}
