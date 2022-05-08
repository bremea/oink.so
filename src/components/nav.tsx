import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

interface NavProps {
  username?: string;
}

const Nav: React.FC<NavProps> = (props) => {
  return (
    <div className='flex h-16 w-full items-center justify-between px-8 shadow-lg backdrop-blur-sm'>
      <Link href='/' passHref>
        <a className='flex items-center text-3xl font-bold text-primary'>
          <Image src='/logo.png' alt='logo' height={64} width={64} />
          <span>oink.so</span>
        </a>
      </Link>
      {props.username ? (
        <Link href={`/${props.username}`} passHref>
          <a className='opacity-50 hover:underline'>@{props.username}</a>
        </Link>
      ) : (
        <Link href='/account' passHref>
          <a className='opacity-50 hover:underline'>Login/Signup</a>
        </Link>
      )}
    </div>
  );
};

export default Nav;
