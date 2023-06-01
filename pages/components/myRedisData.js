
import React from 'react';

const RenderRedis = ({ data }) => {
  console.log('renderRedis', data)
  return (
    <div>
      <h1>Redis Application</h1>
      <ul>
        {data?.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default RenderRedis;
