import axios from 'axios';

const longApiUrl = 'https://control-hogar-psi.vercel.app/api/';
const shortApiUrl = '/api/';
const contentTypeJson = {'Content-Type':'application/json'};
const contentTypeX = {'Content-Type':'application/x-www-form-urlencoded'};
const rokuIp = 'http://192.168.86.28:8060/';
class Requests {
  // async normalApiRequest(api, params, method = 'get') {
  //   let url = shortApiUrl + api;
  //   let info = {method, headers: contentTypeJson};
  //   if (method === 'get' && params) {
  //     params = new URLSearchParams(params);
  //     url = `${url}?${params.toString()}`;
  //   }
  //   if (method === 'post') {
  //     info.body = JSON.stringify(params);
  //   }
  //   const response = await fetch(url, info);
  //   if (response.status === 200) {
  //     console.log(`${method} request to ${api} succeeded`);
  //     return response;
  //   } else {
  //     console.log(`${method} request to ${api} failed`);
  //     return response;
  //   }
  // }
  async normalApiRequest(api, params, method = 'get') {
    let url = shortApiUrl + api;
    let response = '';
    if (method === 'get') {
      if (params) {
        params = new URLSearchParams(params);
        response = await axios.get(`${url}?${params.toString()}`, {headers: contentTypeJson});
      } else {
        response = await axios.get(url, {headers: contentTypeJson});
      }
    }
    if (method === 'post') {
      response = await axios.post(url, params, {headers: contentTypeJson});
    }
    if (response.status === 200) {
      console.log(`${method} request to ${api} succeeded`);
      return response;
    } else {
      console.log(`${method} request to ${api} failed`);
      return response;
    }
  }
  cordovaApiRequest(api, params, method = 'get') {
    let info = {method, headers: contentTypeJson};
    if (method === 'get') {
      if (params) {
        info.params = params;
      } else {
        info.params = {};
      }
    }
    if (method === 'post') {
      info.data = params;
    }
    window.cordova.plugin.http.sendRequest(
      longApiUrl + api,
      info,
      function onSuccess(response) {
        console.log(`${method} request to ${api} succeeded`);
        return response;
      },
      function onError(error) {
        console.error(`${method} request to ${api} failed: `, error);
        return error;
      }
    );
  }

  async sendLogs(message) {
    if (window.cordova) {
      return await this.cordovaApiRequest('sendLogs', { message: message }, 'post');
    } else {
      return await this.normalApiRequest('sendLogs', {message: message}, 'post');
    }
  }
  async getStates() {
    if (window.cordova) {
      return await this.cordovaApiRequest('getDevices', null, 'get');
    } else {
      return await this.normalApiRequest('getDevices', null, 'get');
    }
  }
  async setCredentials(userCredential) {
    if (window.cordova) {

      return await this.cordovaApiRequest('validateCredentials', {key: userCredential}, 'post');

      // window.cordova.plugin.http.sendRequest(
      //   apiUrl + 'validateCredentials',
      //   {method: "post", headers: contentTypeJson, data: {key: userCredential}},
      //   function onSuccess(response) {
      //     console.log('Request to ValidateCredentials succeeded');
      //     const data = JSON.parse(response.data);
      //     if (data.success) {
      //       if (data.dev) {
      //         localStorage.setItem('user', data.dev);
      //         setCredential(devCredential.current);
      //       } else {
      //         localStorage.setItem('user', ownerCredential.current);
      //         setCredential(ownerCredential.current);
      //       }
      //     }
      //   },
      //   function onError(error) {
      //     console.error('Request to ValidateCredentials failed: ', error);
      //   }
      //);
    } else {
      return await this.normalApiRequest('validateCredentials', {key: userCredential}, 'post');
      // const res = await fetch("/api/validateCredentials", {method: "POST", headers: contentTypeJson, body: JSON.stringify({key: userCredential})});
      // const data = await res.json();
      // if (data.success) {
      //   if (data.dev) {
      //     localStorage.setItem('user', data.dev);
      //     setCredential(devCredential.current);
      //   } else {
      //     localStorage.setItem('user', ownerCredential.current);
      //     setCredential(ownerCredential.current);
      //   }
      // }
    }
  }
}
export default Requests;
