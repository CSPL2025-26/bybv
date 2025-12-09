import axios from 'axios';
import constant from './constants'; 
const client = axios.create({
  baseURL: constant.API_URL,
});

// Request interceptor
client.interceptors.request.use(
  (config) => {
    // Modify the config object before sending the request
    // console.log('Request interceptor');
    // console.log('Request config:', config);
    return config;
  },
  (error) => {
   // window.location.href = '/error_404';
    return Promise.reject(error);
  }
);

// Response interceptor
client.interceptors.response.use(
  (response) => {
    // Handle the response data
    const currentUrl = window.location.href;
    const containsQuestionMark = currentUrl.includes('?');
    if(containsQuestionMark){
      //window.location.href = '/error_404';
    }
  
    return response;
  },
  (error) => {
    //window.location.href = '/error_404';
    return Promise.reject(error);
  }
);
function getauthtoken(){
  let getuserdata = JSON.parse(localStorage.getItem("USER_SESSION"));

  let token = getuserdata?.user_token
  
  let Authtoken = '';
  if(token !=null && token !='' && token !=undefined){
      Authtoken = token;
  }
  const config = {
    headers: { 'X-authorization': `Bearer ${Authtoken}` }
  };
  return config;
}
function getauthtemptoken(){
  let token = localStorage.getItem('TEMP_USER_TOKEN');
  let Authtoken = '';
  if(token !=null && token !='' && token !=undefined){
      Authtoken = token;
  }
  const config = {
    headers: { 'X-Authorization': `Bearer ${Authtoken}` }
  };
  return config;
}

export class ApiService {
  static async fetchData(url) {
    try {
      const response = await client.get(url, getauthtoken());
      return response.data;
    } catch (error) {
      if(error){
        console.error('Error fetching data:', error);
        localStorage.removeItem("USER_SESSION")
        //  window.location.href="/"
      }
      console.error('Error fetching data:', error?.status);
    
    }
  }

  static async postData(url,data) {
    try {
      const response = await client.post(url, data, getauthtoken());
      return response.data;
    } catch (error) {
      // console.error('Error posting data:', error);
      throw error;
    }
  }

  static async loginProccessPostData(url,data) {
    try {
      const response = await client.post(url, data, getauthtemptoken());
      return response.data;
    } catch (error) {
      // console.error('Error posting data:', error);
      throw error;
    }
  }

  static async numberFormat(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
