import Link from 'next/link';
import * as React from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

interface StatusProps {
  username: string;
  status: string;
  likes: number;
  liked: boolean;
  edible: boolean;
}

const Status: React.FC<StatusProps> = (props) => {
  const [status, setStatus] = React.useState(props.status);
  const [liked, setLiked] = React.useState(props.liked);
  const [likes, setLikes] = React.useState(props.likes);
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

  const likePost = async () => {
    setLiked(true);
    setLikes(likes + 1);
    await fetch('/api/like', {
      method: 'POST',
      headers: {
        Authorization: window.localStorage.getItem('token') as string,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ like: props.username }),
    });
  };

  const unlikePost = async () => {
    setLikes(likes - 1);
    setLiked(false);
    await fetch('/api/unlike', {
      method: 'POST',
      headers: {
        Authorization: window.localStorage.getItem('token') as string,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ like: props.username }),
    });
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
            {liked ? (
              <AiFillHeart
                className='cursor-pointer text-sm text-primary opacity-50 transition-all'
                onClick={unlikePost}
              />
            ) : (
              <AiOutlineHeart
                className='cursor-pointer text-sm opacity-50 transition-all hover:text-primary'
                onClick={likePost}
              />
            )}
            <p className='text-sm opacity-50'>
              {likes > 0 ? <span className='ml-2'>{likes}</span> : ''}
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
