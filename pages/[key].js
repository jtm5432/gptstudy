import myfirebase from './api/lib/fireBase.js';
import RenderRedisTextArea from './components/RedisTextArea.js';
import { useState } from 'react';


export default function KeyPage({ response }) {
  const [renderData, setRenderData] = useState(response);
  const handleDelete = async (index,idArray) => {
    await Promise.all(idArray.map(e => myfirebase.deleteData(index, e)));
     
    // firbase는 onSnapshot 과 같은 실시간 리스너를 추가해서 callback을 받아야한다. 나중에 추가할것.
      
    return setTimeout(updatedDataAndRender(),5000);
  
    /*
    // 삭제 작업 발생 시 상태를 업데이트하여 다시 렌더링
    //await myRedis.deleteData(keyData,index)
    */
  };
  const redisListDivStyle = {
    height: "80vh", // document의 80% 높이에 해당하는 값으로 설정 (조정 가능)
  };
  //keydata가 array가 아니라면  
  const handleSave = async (text, id, collection) => {
    console.log('handlesave',text,id)
    
    return await myfirebase.setCollection(collection).saveData(id, text); 
    
  
    
  }
  const updatedDataAndRender = async () => {
    let updatedData =await getfirebaseData(index).then(querySnapshot => {
      return querySnapshot.docs.map(doc => {
        return { id: doc.id, keyData: index, data: doc.data() };
      });
    });
    return setRenderData(updatedData)
  }

  if (!Array.isArray(response)) { 
    console.log('keyData',response)
    return <div>
      <RenderRedisTextArea 
        key={renderData} data={response} index={0}
        />
      </div>;
  } 
  else {
    console.log('keyData',response.length)
    //검색된 결과를 textarea에 넣어준다.
    return (
      <div id="RedisListDiv"  style={redisListDivStyle}>
        {renderData.map((item, index) => (
          <RenderRedisTextArea 
           key={item.id}
           keyData={item.keyData}
           data={item.data.value}
           index={index}
           onDelete={() => handleDelete(item.keyData,[item.id])}
           onSave={async (text, index = item.keyData ) =>await handleSave(text,item.id,index)}
          />
         ))}
      </div>
      )
  }
}
async function getfirebaseData(keyData){

  try {
     return await myfirebase.get(keyData);    
  } catch(E){
    console.log('Error',E)
    return [];
  }
}

export async function getServerSideProps(context) {
  const keyData = context.params.key;
  let response = await getfirebaseData(keyData).then(querySnapshot => {
    return querySnapshot.docs.map(doc => {
      return { id: doc.id, keyData: keyData, data: doc.data() };
    });
  });; 
  console.log('getdata',response);
  return {
    props: {
      response
      // Add any other props your component needs
    },
  };
}