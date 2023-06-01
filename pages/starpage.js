import React from 'react';
import axios from 'axios';
import RenderRedis from './components/myRedisData.js';
import myRedis from './api/lib/redisClient.js';

const HomePage = ({ data }) => {
  return <RenderRedis data={data} />
};

export async function getServerSideProps() {
  //서버사이드 랜더링인데 axios같은거 쓸 필요가 없다.
  //const response = await fetch('http://localhost:4000/api/renderRedis');
  let response;
  try {
     response  = await myRedis.getKeyArray('*');
  } catch (E){
    console.log('Error',E);
  }
  

  let data = response;
  console.log('data',data);
  if(!data ) data = [];
 // else data = data.map((e) => e.replaceAll('\n',''))
  return {
    props: { data }, // will be passed to the page component as props
  };
}

export default HomePage;