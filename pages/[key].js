import MyRedisData from './components/myRedisData.js';
import myRedis from './api/lib/redisClient.js';
import RenderRedisTextArea from './components/RedisTextArea.js';
import { createContext, useContext, useState } from 'react';


export default function KeyPage({ response,keyData }) {
  const [renderData, setRenderData] = useState(response);
  const handleDelete = async (index) => {
    // 삭제 작업 발생 시 상태를 업데이트하여 다시 렌더링
   // await myRedis.deleteData(keyData,index)
    let updatedData = [...renderData];
    setRenderData(updatedData);
  };
  //keydata가 array가 아니라면


  if (!Array.isArray(response)) { 
    console.log('keyData',response)
    return <div><RenderRedisTextArea key={renderData} data={response} index={0}/></div>;
  } 
  else {
    console.log('keyData',response.length)
    //검색된 결과를 textarea에 넣어준다.
    return (
      <div id="RedisListDiv">
        {renderData.map((item, index) => (
          <RenderRedisTextArea  key={index} data={item} index={index} onDelete={() => handleDelete(index)}/>
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
      response,keyData
      // Add any other props your component needs
    },
  };
}