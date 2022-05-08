import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { FiArrowRight } from 'react-icons/fi';

import Layout from '@/components/layout/Layout';
import Nav from '@/components/nav';
import Seo from '@/components/Seo';

export default function Account() {
  const [phone, setPhone] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState('');
  const [header, setHeader] = React.useState("👋 Let's get started");
  const [action, setAction] = React.useState('Input your phone number below.');
  const [step, setStep] = React.useState(0);
  const router = useRouter();

  React.useEffect(() => {
    setPhone(phone.replace(/^(?!.*\+?[0-9]{0,15}).*/g, ''));
    setPhone(phone.replace(' ', ''));
    setCode(code.replace(/^(?!.*[0-9]{0,6}).*/g, ''));
    setCode(code.replace(' ', ''));
  }, [phone, code]);

  const sendReqPhone = async () => {
    disableBtn();
    const req = await fetch('/api/register/phone', {
      method: 'POST',
      body: JSON.stringify({ phone: phone }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await req.json();
    unDisableBtn();
    if (res.error) {
      setError(res.error);
    } else {
      setHeader('🔒 We sent you a text');
      setAction('Enter the authentication code below.');
      setStep(1);
    }
  };

  const sendReqCode = async () => {
    disableBtn();
    const req = await fetch('/api/register/validate', {
      method: 'POST',
      body: JSON.stringify({ phone: phone, code: code }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await req.json();
    if (res.error) {
      unDisableBtn();
      setError(res.message);
    } else {
      if (res.token) {
        login(res.token);
      } else {
        unDisableBtn();
        setHeader('😄 Finish signing up');
        setAction('Enter a username below for your account.');
        setStep(2);
      }
    }
  };

  const sendReqUsername = async () => {
    disableBtn();
    const req = await fetch('/api/register/signup', {
      method: 'POST',
      body: JSON.stringify({ username: username, phone: phone }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await req.json();
    if (res.error) {
      unDisableBtn();
      setError(res.message);
    } else {
      login(res.token);
    }
  };

  const login = (token: string) => {
    window.localStorage.setItem('token', token);
    router.push('/');
  };

  const disableBtn = () => {
    document.getElementById('btn-submit')?.classList.add('loading');
    document.getElementById('btn-submit')?.classList.add('disabled');
    document.getElementById('btn-submit-icon')?.classList.add('hidden');
  };
  const unDisableBtn = () => {
    document.getElementById('btn-submit')?.classList.remove('loading');
    document.getElementById('btn-submit')?.classList.remove('disabled');
    document.getElementById('btn-submit-icon')?.classList.remove('hidden');
  };

  return (
    <Layout>
      <Seo />

      <main>
        <section>
          <div className='layout wavy flex h-screen flex-col'>
            <Nav />
            <div className='flex h-full flex-col justify-center pl-12'>
              <h1 className='text-4xl font-bold'>{header}</h1>
              <p className='mb-8 text-lg'>{action}</p>
              {error ? (
                <div className='alert alert-error mb-8 w-full max-w-md shadow-lg'>
                  <div>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6 flex-shrink-0 stroke-current'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
              ) : (
                <></>
              )}

              <div className='form-control'>
                <div className='input-group'>
                  {step === 0 ? (
                    <input
                      id='phone-number'
                      type='tel'
                      placeholder='Phone Number'
                      pattern='\+?[0-9]{15}'
                      maxLength={15}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className='input input-bordered w-full max-w-md'
                    />
                  ) : step === 1 ? (
                    <input
                      id='auth-code'
                      type='number'
                      placeholder='Auth Code'
                      pattern='[0-9]{6}'
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className='input input-bordered w-full max-w-md'
                    />
                  ) : (
                    <input
                      id='username'
                      type='text'
                      placeholder='Username'
                      maxLength={25}
                      pattern='^[a-zA-Z0-9_]*$'
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className='input input-bordered w-full max-w-md'
                    />
                  )}
                  <a
                    className='btn btn-square'
                    onClick={
                      step === 0
                        ? sendReqPhone
                        : step === 1
                        ? sendReqCode
                        : sendReqUsername
                    }
                    id='btn-submit'
                  >
                    <FiArrowRight className='text-lg' id='btn-submit-icon' />
                  </a>
                </div>
                <footer className='absolute bottom-2 w-full text-center'>
                  made with ❤️ by{' '}
                  <Link href='/brett' passHref>
                    <a className='link'>@brett</a>
                  </Link>
                </footer>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
