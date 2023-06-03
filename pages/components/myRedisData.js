
import React from 'react';
import Link from 'next/link';


const RenderRedis = ({ data }) => {
  console.log('renderRedis', data)
  return (
    <div>
      <h1>Redis Application</h1>
      <ul>
        {data?.map((item, index) => (
           <li key={index}>
            <Link href={`/${item}`}>{item}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RenderRedis;
