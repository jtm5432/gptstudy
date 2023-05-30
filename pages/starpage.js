import React from 'react';
import axios from 'axios';
import RenderRedis from '.  /components/myRedisData.js';

const HomePage = ({ data }) => {
  return <RenderRedis data={data} />
};

export async function getServerSideProps() {
  const response = await axios.get('/api/renderRedis');

  if (!response.ok) {
    return {
      notFound: true,
    };
  }

  let data = await response.json();
  console.log(data);
  if(!data ) data = [];
  return {
    props: { data }, // will be passed to the page component as props
  };
}

export default HomePage;