import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const longApiUrl = 'https://control-hogar-psi.vercel.app/api/';
const shortApiUrl = '/api/';
const contentTypeJson = {'Content-Type':'application/json'};
const contentTypeX = {'Content-Type':'application/x-www-form-urlencoded'};
const rokuIp = 'http://192.168.86.28:8060/';
const xmlParser =  new XMLParser({ignoreAttributes: false, attributeNamePrefix: ''});
class Requests {
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
    if (method === 'put') {
      response = await axios.put(url, params, {headers: contentTypeJson});
    }
    if (response.status === 200) {
      console.log(`${method} request to ${api} succeeded`);
      return {status: response.status, data: response.data};
    } else {
      console.log(`${method} request to ${api} failed`);
      return {status: response.status, data: ''};
    }
  }
  async cordovaApiRequest(api, params, method, serializer) {
    let info = { method, headers: contentTypeJson };
    if (method === 'get') {
      info.params = params || {};
    }
    if (serializer) {
      info.serializer = serializer;
    }
    if (method === 'post' || method === 'put') {
      info.data = params;
    }
    return new Promise((resolve, reject) => {
      window.cordova.plugin.http.setHeader('*', 'User-Agent', 'Mozilla/5.0');
      window.cordova.plugin.http.setHeader('*', 'Accept', 'application/json');
      window.cordova.plugin.http.setHeader('*', 'Origin', '');
      window.cordova.plugin.http.setHeader('*', 'Referer', '');
      window.cordova.plugin.http.sendRequest(
        longApiUrl + api,
        info,
        function onSuccess(response) {
          console.log(`${method} request to ${api} succeeded`);
          resolve({status: response.status, data: JSON.parse(response.data)});
        },
        function onError(error) {
          console.error(`${method} request to ${api} failed: `, error);
          reject(error);
        }
      );
    });
  }
  async cordovaPost() {
    window.cordova.plugin.http.post(
      longApiUrl + 'save-video',
      {
        label: 'Caillou goes camping',
        description: 'Little kid in the forest',
        yid: '5tVd50YAJP0',
        img: 'https://img.youtube.com/vi/5tVd50YAJP0/sddefault.jpg',
        order: 0,
        state: '',
        channel: 'caillow',
      },
      { 'Content-Type': 'application/json' },
      response => console.log('✅ Guardado', response),
      error => console.error('❌ Error', error)
    );
  }

  async guardarVideo() {
    await this.normalApiRequest(
      'saveVideos',
      {
        label: 'Caillou goes camping',
        description: 'Little kid in the forest',
        yid: '5tVd50YAJP0',
        img: 'https://img.youtube.com/vi/5tVd50YAJP0/sddefault.jpg',
        order: 0,
        state: '',
        channel: 'caillow',
      },
      'post'
    );
  }

  async sendLogs(message) {
    if (window.cordova) {
      return await this.cordovaApiRequest('sendLogs', {message: message}, 'post');
    } else {
      return await this.normalApiRequest('sendLogs', {message: message}, 'post');
    }
  }
  async getMassMediaData() {
    if (window.cordova) {
      return await this.cordovaApiRequest('getDevices', null, 'get');
    } else {
      return await this.normalApiRequest('getDevices', null, 'get');
    }
  }
  async getRokuData(param) {
    if (window.cordova) {
      return new Promise((resolve, reject) => {
        window.cordova.plugin.http.sendRequest(
          `${rokuIp}query/${param}`,
          {
            method: 'get',
            headers: {},
            params: {}
          },
          function onSuccess(response) {
            console.log(`get request to roku succeeded`);
            resolve({status: response.status, data: xmlParser.parse(response.data)});
          },
          function onError(error) {
            console.error(`get request to roku failed: `, error);
            reject(error);
          }
        );
      });
    } else {
      return null;
    }
  }
  async setCredentials(userCredential) {
    if (window.cordova) {
      return await this.cordovaApiRequest('validateCredentials', {key: userCredential}, 'post');
    } else {
      return await this.normalApiRequest('validateCredentials', {key: userCredential}, 'post');
    }
  }
  async setDevices(devices) {
    if (window.cordova) {
      return await this.cordovaApiRequest('setDevices', devices, 'put', 'json');
    } else {
      return await this.normalApiRequest('setDevices', devices, 'put');
    }
  }
  async sendIfttt(params, sendDisabled) {
    if (!sendDisabled) {
      if (window.cordova) {
        return await this.cordovaApiRequest('sendIfttt', params, 'get');
      } else {
        return await this.normalApiRequest('sendIfttt', params, 'get');
      }
    }
  }
  async sendControl(sendDisabled, params) {
    if (params.ifttt) {
      params.ifttt.forEach(el => {
        if (el.device === 'rokuSala') {
          if (!window.cordova) {
              this.sendIfttt({
                device: el.device,
                key: el.key,
                value: el.value
              }, sendDisabled);
          }
        } else {
          this.sendIfttt({
            device: el.device,
            key: el.key,
            value: el.value,
          }, sendDisabled);
        }
      });
    }
    if (params.roku) {
      params.roku.forEach(el => {
        if (window.cordova) {
          this.fetchRoku({
            key: el.key,
            value: el.value,
            params: el.params,
          }, sendDisabled);
        }
      });
    }
  }
  async fetchRoku(params, sendDisabled) {
    let url = '';
    if (params.params) {
      const par = new URLSearchParams(params.params);
      url = `${rokuIp}${params.key}/${params.value}?${par.toString()}`;
    } else {
      url = `${rokuIp}${params.key}/${params.value}`;
    }
    if (!sendDisabled) {
      const sendRequestPromise = new Promise((resolve, reject) => {
        window.cordova.plugin.http.sendRequest(
          url,
          {method: 'post', headers: contentTypeX, data: {}, serializer: 'urlencoded'},
          () => {resolve(true);},
          (error) => {reject(error);}
        );
      });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Roku not responding")), 500)
      );
      Promise.race([sendRequestPromise, timeoutPromise]).then(() => {
        console.log('Request to Roku succeeded');
      }).catch(async() => {
        return await this.cordovaApiRequest('sendIfttt', params, 'get');
      });
    }
  }
}
export default Requests;
