import axios from 'axios';


//const host = 'http://localhost:8080';

async function testGET(host) {
    try {
        const response = await axios.get(host);
        return (response.data);
    } catch (error) {
       return console.error(error)
    }
}



async function testPOST(host,payload) {
  try{  const response = await axios.post(host, payload);
    return response.data;
    }
      catch (error) {
       return console.error(error)
    }
}

async function testPUT(host,payload) {
  try { 
    const response = await axios.put(host, payload);
    return response.data;
    }
    catch (error) {
        return console.error(error)
    }
}

async function testDELETE(host,payload) {
    try { 
      const response = await axios.delete(host);
      return response.data;
      }
      catch (error) {
          return console.error(error)
      }
  }
  




export {testGET, testPOST, testPUT, testDELETE}
