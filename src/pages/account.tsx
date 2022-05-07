import * as React from 'react';
import { FiArrowRight } from 'react-icons/fi';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

export default function Account() {
  const [phone, setPhone] = React.useState('');
  const [header] = React.useState("👋 Let's get started");
  const [action] = React.useState('Input your phone number below.');

  React.useEffect(() => {
    setPhone(phone.replace(/^(?!.*\+?[0-9]{0,15}).*/g, ''));
    setPhone(phone.replace(' ', ''));
  }, [phone]);

  const sendReq = async () => {
    const req = await fetch('/api/register/phone', {
      method: 'POST',
      body: JSON.stringify({ phone: phone }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await req.json();
    // eslint-disable-next-line no-console
    console.log(res);
  };

  return (
    <Layout>
      <Seo />

      <main>
        <section>
          <div className='layout wavy flex min-h-screen flex-col justify-center pl-12'>
            <h1 className='text-4xl font-bold'>{header}</h1>
            <p className='mb-8 text-lg'>{action}</p>
            <div className='form-control'>
              <div className='input-group'>
                <input
                  id='phone-number'
                  type='tel'
                  placeholder='Phone Number'
                  pattern='\+?[0-9]{15}'
                  maxLength={15}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className='input input-bordered w-full max-w-md bg-opacity-0'
                />
                <a className='btn btn-square' onClick={sendReq}>
                  <FiArrowRight className='text-lg' />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
