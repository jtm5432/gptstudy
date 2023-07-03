import firebase from 'firebase/app';
import "firebase/firestore";
import 'firebase/database';
import 'firebase/analytics'; // Ensure you have installed firebase analytics npm module.

const firebaseConfig = {
  // Your Firebase configuration details
  apiKey: "AIzaSyCMdXSzdJk7FN-LitwPmtgjvGDFljEKbYE",
  authDomain: "firestorestudy-9eaed.firebaseapp.com",
  projectId: "firestorestudy-9eaed",
  storageBucket: "firestorestudy-9eaed.appspot.com",
  messagingSenderId: "608026725042",
  appId: "1:608026725042:web:cd6b159a4b0f84f3f117ab",
  measurementId: "G-3MQ55LVLT4"
};

let app;

if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}


const myfirebase = {
    setCollection: function(colname) {
        this.collection = colname;
        return this;
    },
    /**
     * 
     */
    getCollection: async function(collection = this.collection) {
      try {
        //firebase.firestore().collection는 동기적으로 동작한다는데 막상 실행해보면 비동기다...
        return await firebase.firestore().collection(collection);
      } catch(e){
        console.log(collection,'is wrong');
        return ; 
      }
    },
     /**
     * collection : index명
     * document : id, name .
     */
    set:async function(collection, document) { 
        return await collection.doc(document);
    },
     /**
     * collection : index명
     * document : id, name .document가 null값이면 해당 collection의 모든 document를 array로 가져온다
     */
    get:async function(collection, document) {
      return document? await collection.doc(document).get() : await firebase.firestore().collection(collection).get();
      
    },
    saveData:async function (document, sdata)  {
      const Now = Date.now();
      let data = {
        value: sdata,
        timestamp: Now,
        // 다른 필드들...
      };
      try {
        let Collection =await this.getCollection();
         await Collection.doc(document).set(data);
         return "saveComplete";
       }
       catch (E) {
        return "error";
       }
    },
    deleteData:async function(collection, document) {
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
        }
          /**
           * collection에 대한 선언은 비동기다. 
           */
          let Collection =await this.getCollection(collection);
          console.log('deletData',collection,document,Collection)
          return await Collection.doc(document).delete();
        } catch(error) {
          console.error("Error deletdata: ", error);
          throw error;
        }
    },
    getDataAfter:async function(collection, startAfterDoc, limit=3) {
      let query =firebase.firestore().collection(collection).orderBy('timestmap')

      if (startAfterDoc) {
          query = query.startAfter(startAfterDoc)
      }
      
      
      console.log('query',query);
      return await query.limit(limit).get();

    }


}

export const database = firebase.database();

export default myfirebase;
