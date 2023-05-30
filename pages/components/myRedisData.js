// RenderRedis.js (Assuming it's in components directory)
import React from 'react';

const RenderRedis = ({ data }) => {
  return (
    <div>
      <h1>Redis Application</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default RenderRedis;
