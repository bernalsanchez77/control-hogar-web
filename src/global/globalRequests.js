import axios from 'axios';
import { store } from "../store/store";
import timeSync from '../utils/timeSync';

const CONTENT_TYPES = {
  JSON: { 'Content-Type': 'application/json' },
  X_WWW_FORM_URLENCODED: { 'Content-Type': 'application/x-www-form-urlencoded' },
};

const API_CONFIG = {
  LONG_URL: 'https://control-hogar-psi.vercel.app/api/',
  SHORT_URL: '/api/',
  SHORT_URL_PC: '/api/api/',
};

class Requests {
  constructor(isPc) {
    this.isPc = isPc;
  }

  async normalApiRequest(api, params, method = 'get') {
    try {
      const baseUrl = this.isPc ? API_CONFIG.SHORT_URL_PC : API_CONFIG.SHORT_URL;
      const url = baseUrl + api;
      let response = '';

      const config = { headers: CONTENT_TYPES.JSON };

      if (method === 'get') {
        if (params) {
          const queryParams = new URLSearchParams(params);
          response = await axios.get(`${url}?${queryParams.toString()}`, config);
        } else {
          response = await axios.get(url, config);
        }
      } else if (method === 'post') {
        response = await axios.post(url, params, config);
      } else if (method === 'put') {
        response = await axios.put(url, params, config);
      } else if (method === 'patch') {
        response = await axios.patch(url, params, config);
      }

      if (response && response.status === 200) {
        return { status: response.status, data: response.data };
      }
      return { status: response ? response.status : 0, data: '' };
    } catch (error) {
      console.error(`Api Request Error (${api}):`, error.message);
      return { status: 0, data: '' };
    }
  }

  async cordovaApiRequest(api, params, method, serializer) {
    const info = { method, headers: CONTENT_TYPES.JSON };
    if (method === 'get') {
      info.params = params || {};
    }
    if (serializer) {
      info.serializer = serializer;
    }
    if (['post', 'put', 'patch'].includes(method)) {
      info.data = params;
    }

    return new Promise((resolve, reject) => {
      const { http } = window.cordova.plugin;
      http.setHeader('*', 'User-Agent', 'Mozilla/5.0');
      http.setHeader('*', 'Accept', 'application/json');
      http.setHeader('*', 'Origin', '');
      http.setHeader('*', 'Referer', '');

      http.sendRequest(
        API_CONFIG.LONG_URL + api,
        info,
        (response) => {
          resolve({ status: response.status, data: JSON.parse(response.data) });
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async updateTable(params) {
    if (params.date === undefined) {
      params.date = timeSync.getSyncedIsoString();
    }
    if (params.date === null) {
      delete params.date;
    }
    const userNameDevice = store.getState().userNameDevicesSt;
    params.triggerUser = userNameDevice || 'guest';
    return this._genericRequest('updateTableInSupabase', params, 'patch', 'json');
  }

  async updateSelections(params) {
    if (params.date === undefined) {
      params.date = timeSync.getSyncedIsoString();
    }
    if (params.date === null) {
      delete params.date;
    }
    const userNameDevice = store.getState().userNameDevicesSt;
    params.triggerUser = userNameDevice || 'guest';
    return this._genericRequest('updateSelectionsInSupabase', params, 'patch', 'json');
  }

  async _genericRequest(api, params, method, serializer) {
    if (window.cordova && window.cordova.plugin?.http) {
      try {
        return await this.cordovaApiRequest(api, params, method, serializer);
      } catch (err) {
        console.error(`Cordova Request Fail (${api}):`, err);
        return null;
      }
    }
    return this.normalApiRequest(api, params, method);
  }
}

const requests = new Requests(window.location.hostname === 'localhost' && !window.cordova);
export default requests;
