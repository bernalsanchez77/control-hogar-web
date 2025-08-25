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
    if (method === 'patch') {
      response = await axios.patch(url, params);
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
    if (method === 'post' || method === 'put' || method === 'patch') {
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
  async saveVideo() {
    await this.normalApiRequest(
      'saveVideoInSupabase',
      {
                            label: 'Halloween Party',
                            description: 'Halloween Party',
                            yid: 'ODBJliTc2j4',
                            img: 'https://img.youtube.com/vi/ODBJliTc2j4/sddefault.jpg',
                            state: '',
                            channel: 'caillou',
                            date: new Date().toISOString(),
                            order: 0,
      },
      'post');
  }
  async updateTableInSupabase(params) {
    if (window.cordova) {
      await this.cordovaApiRequest('updateTableInSupabase', params, 'patch', 'json');
    } else {
      await this.normalApiRequest('updateTableInSupabase', params, 'patch');
    }
  }
  async getTableFromSupabase(table) {
    if (window.cordova) {
      return await this.cordovaApiRequest('getTableFromSupabase', {table}, 'get');
    } else {
      return await this.normalApiRequest('getTableFromSupabase', {table}, 'get');
    }
  }
  // async searchYoutube(text) {
  //   console.log(text);
  //   try {
  //     const res = await axios.get('https://www.googleapis.com/youtube/v3/search', {
  //       params: {
  //         part: 'snippet',
  //         maxResults: 10,
  //         q: text,
  //         type: 'video',
  //         key: 'AIzaSyAm7Z-IXj2M9we65X0V2YmRM3URgn6tqWk'
  //       }
  //     });
  //     return res.data.items;
  //   } catch (error) {
  //     console.error('Search error:', error);
  //   }
  // }

  async searchYoutube(text) {
    let res = {};
    if (window.cordova) {
      res = await this.cordovaApiRequest('getVideosFromYoutube', {q: text}, 'get');
    } else {
      res = await this.normalApiRequest('getVideosFromYoutube', {q: text}, 'get');
    }
    return res.data.items;
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
      const getRequestPromise = new Promise((resolve, reject) => {
        window.cordova.plugin.http.sendRequest(
          `${rokuIp}query/${param}`,
          {method: 'get', headers: {}, params: {}},
          (response) => {resolve(response);},
          (error) => {reject(error);}
        );
      });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Roku not responding')), 300)
      );
      return Promise.race([getRequestPromise, timeoutPromise]).then((response) => {
        console.log('Get request to Roku succeeded');
        return {status: response.status, data: xmlParser.parse(response.data)};
      }).catch((error) => {
        console.log('Get request to Roku failed');
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
  async sendIfttt(params, sendEnabled) {
    if (sendEnabled) {
      if (window.cordova) {
        return await this.cordovaApiRequest('sendIfttt', params, 'get');
      } else {
        return await this.normalApiRequest('sendIfttt', params, 'get');
      }
    }
  }
  async sendControl(sendEnabled, params) {
    if (params.ifttt) {
      params.ifttt.forEach(el => {
        if (el.device === 'rokuSala') {
          if (!window.cordova) {
              this.sendIfttt({
                device: el.device,
                key: el.key,
                value: el.value
              }, sendEnabled);
          }
        } else {
          this.sendIfttt({
            device: el.device,
            key: el.key,
            value: el.value,
          }, sendEnabled);
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
          }, sendEnabled);
        }
      });
    }
  }
  async fetchRoku(params, sendEnabled) {
    let url = '';
    if (params.params) {
      const par = new URLSearchParams(params.params);
      url = `${rokuIp}${params.key}/${params.value}?${par.toString()}`;
    } else {
      url = `${rokuIp}${params.key}/${params.value}`;
    }
    if (sendEnabled) {
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
