import Link from 'next/link';
import * as React from 'react';
import { FiHeart } from 'react-icons/fi';

interface StatusProps {
  username: string;
  status: string;
  likes: number;
  edible: boolean;
}

const Status: React.FC<StatusProps> = (props) => {
  const [status, setStatus] = React.useState(props.status);
  const [statusChanged, setStatusChanged] = React.useState(false);

  const saveStatus = async () => {
    if (statusChanged)
      await fetch('/api/status', {
        method: 'POST',
        headers: {
          Authorization: window.localStorage.getItem('token') as string,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: status }),
      });
    setStatusChanged(false);
  };

  return (
    <div className='m-8 h-64 w-64 overflow-auto rounded-xl bg-neutral p-4 text-left shadow-lg'>
      <div className='flex items-center justify-between'>
        <Link href={`/${props.username}`} passHref>
          <a className='text-left text-sm opacity-50 hover:underline'>
            @{props.username}
          </a>
        </Link>
        {props.likes >= 0 ? (
          <div className='flex items-center'>
            <FiHeart className='text-sm opacity-50' />
            <p className='ml-2 text-sm opacity-50'>
              {props.likes > 0 ? props.likes : ''}
            </p>
          </div>
        ) : (
          <></>
        )}
      </div>
      {props.edible ? (
        <textarea
          className='textarea mt-1 h-48 w-full bg-neutral p-0'
          placeholder='Your Status'
          onBlur={saveStatus}
          maxLength={200}
          onChange={(e) => {
            setStatus(e.target.value);
            setStatusChanged(true);
          }}
        >
          {props.status}
        </textarea>
      ) : (
        <p className='break-word mt-1'>{props.status}</p>
      )}
    </div>
  );
};

export default Status;
