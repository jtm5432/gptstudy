import MyRedisData from './components/myRedisData.js';
import myRedis from './api/lib/redisClient.js';
import RenderRedisTextArea from './components/RedisTextArea.js';

export default function KeyPage({ response }) {
  //keydata가 array가 아니라면
  if (!Array.isArray(response)) { 
    console.log('keyData',response)
    return <div><RenderRedisTextArea  data={response} /></div>;
  } 
  else {
    //검색된 결과를 textarea에 넣어준다.
    return (
      <div>
        {response.map((item, index) => (
          <RenderRedisTextArea key={index} data={item} />
        ))}
      </div>
      )
  }
}

export async function getServerSideProps(context) {
  const keyData = context.params.key;
  let response; 
  try {
    response = await myRedis.getData([keyData]);
  } catch(E){
    console.log('Error',E)
  }
  response=response[keyData];
  console.log('getdata',response,'keydata',[keyData]);
  //getData
  // Do any server-side operations you need to get data for MyRedisData

  return {
    props: {
      response,
      // Add any other props your component needs
    },
  };
}