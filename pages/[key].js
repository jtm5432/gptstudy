import fireBaseData from './api/lib/fireBase.js';
import RenderRedisTextArea from './components/RedisTextArea.js';
import { useState } from 'react';


export default function KeyPage({ response }) {
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
          <RenderRedisTextArea  key={item.id} keyData={item.keyData} data={item.data.value} index={index} onDelete={() => handleDelete(index)}/>
         ))}
      </div>
      )
  }
}

export async function getServerSideProps(context) {
  const keyData = context.params.key;
  let response; 
  try {
    response = await fireBaseData.get(keyData)
    .then(querySnapshot => {
      return querySnapshot.docs.map(doc => {
        return { id: doc.id, keyData: keyData, data: doc.data() };
      });
    });
  } catch(E){
    console.log('Error',E)
  }
  
  console.log('getdata',response);
  //getData
  // Do any server-side operations you need to get data for MyRedisData

  return {
    props: {
      response
      // Add any other props your component needs
    },
  };
}