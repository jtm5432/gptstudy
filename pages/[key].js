import MyRedisData from './components/myRedisData.js';
import myRedis from './api/lib/redisClient.js';
export default function KeyPage({ keyData }) {
  return <MyRedisData keyData={keyData} />
}

export async function getServerSideProps(context) {
  const keyData = context.params.key;
  let response; 
  try {
    response = await myRedis.getData([keyData]);
  } catch(E){
    console.log('Error',E)
  }
  console.log('getdata',response,[keyData]);
  //getData
  // Do any server-side operations you need to get data for MyRedisData

  return {
    props: {
      keyData,
      // Add any other props your component needs
    },
  };
}