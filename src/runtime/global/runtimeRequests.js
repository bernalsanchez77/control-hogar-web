import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { store } from "../../store/store";
import request from '../../global/globalRequests';

const xmlParser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });

const CONTENT_TYPES = {
  JSON: { 'Content-Type': 'application/json' },
  X_WWW_FORM_URLENCODED: { 'Content-Type': 'application/x-www-form-urlencoded' },
};

const ROKU_CONFIG = {
  IP: 'http://192.168.86.174:8060/',
  IP_PC: '/roku/',
  POST_TIMEOUT: 1000,
};

class Requests {
  async sendIfttt(params, sendEnabled) {
    params.key = params.key || 'state';
    const isEnabled = sendEnabled !== undefined ? sendEnabled : store.getState().sendEnabledSt;
    if (isEnabled) {
      return request._genericRequest('sendIfttt', params, 'get');
    }
  }

  async updateSelections(params) {
    return request.updateSelections(params);
  }

  async updateTable(params) {
    return request.updateTable(params);
  }

  async fetchRoku(params) {
    const { sendEnabledSt } = store.getState();
    if (!sendEnabledSt) return;

    const query = params.params ? `?${new URLSearchParams(params.params).toString()}` : '';
    const baseUrl = window.cordova ? ROKU_CONFIG.IP : ROKU_CONFIG.IP_PC;
    const url = `${baseUrl}${params.key}/${params.value}${query}`;

    const sendRequestPromise = new Promise((resolve, reject) => {
      if (window.cordova?.plugin?.http) {
        window.cordova.plugin.http.sendRequest(
          url,
          { method: 'post', headers: CONTENT_TYPES.X_WWW_FORM_URLENCODED, data: {}, serializer: 'urlencoded' },
          resolve,
          reject
        );
      } else {
        axios.post(url, {}, { headers: CONTENT_TYPES.X_WWW_FORM_URLENCODED })
          .then(resolve)
          .catch(reject);
      }
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Roku not responding")), ROKU_CONFIG.POST_TIMEOUT)
    );

    try {
      await Promise.race([sendRequestPromise, timeoutPromise]);
    } catch (error) {
      console.log("Roku Fetch Error (Switching to IFTTT):", error.message);
      if (window.cordova && window.cordova.plugin?.http) {
        await request.cordovaApiRequest('sendIfttt', params, 'get');
      }
    }
  }

  async getRokuData(param) {
    const getRequestPromise = new Promise((resolve, reject) => {
      if (window.cordova?.plugin?.http) {
        window.cordova.plugin.http.sendRequest(
          `${'http://192.168.86.174:8060/'}query/${param}`,
          { method: 'get', headers: {}, params: {} },
          (response) => resolve(response),
          (error) => reject(error)
        );
      } else {
        axios.get(`${'/roku/'}query/${param}`)
          .then(resolve)
          .catch(reject);
      }
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Roku not responding')), 2000)
    );

    try {
      const response = await Promise.race([getRequestPromise, timeoutPromise]);
      return {
        status: response.status,
        data: xmlParser.parse(response.data)
      };
    } catch (error) {
      console.log("Roku Data Request Error:", error.message || error);
      return null;
    }
  }
}

const requests = new Requests(window.location.hostname === 'localhost' && !window.cordova);
export default requests;
