import axios from 'axios';
import { store } from "../../store/store";
import { API_CONFIG, CONTENT_TYPES, ENDPOINTS } from '../../global/constants';
import timeSync from '../../utils/timeSync';
import utils from '../../utils/utils';


class Requests {
  constructor(isPc) {
    this.isPc = isPc;
  }

  async requestErrorHandler() {
    const isConnectedToInternet = await utils.getIsConnectedToInternet();
    if (!isConnectedToInternet) {
      // connection.onNoInternet();
    }
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
      this.requestErrorHandler();
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
          this.requestErrorHandler();
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
    return this._genericRequest(ENDPOINTS.UPDATE_TABLE, params, 'patch', 'json');
  }

  async upsertTable(params) {
    if (params.date === undefined) {
      params.date = timeSync.getSyncedIsoString();
    }
    if (params.date === null) {
      delete params.date;
    }
    return this._genericRequest(ENDPOINTS.UPSERT_TABLE, params, 'patch', 'json');
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
    return this._genericRequest(ENDPOINTS.UPDATE_SELECTIONS, params, 'patch', 'json');
  }

  async getTable(table) {
    return this._genericRequest(ENDPOINTS.GET_TABLE, { table }, 'get');
  }

  async searchYoutube(text) {
    const res = await this._genericRequest(ENDPOINTS.GET_YOUTUBE_VIDEOS, { q: text }, 'get');
    return res && res.status === 200 ? res.data.items : null;
  }

  async sendLogs(message, user) {
    const logMessage = window.cordova ? `${window.device.model} ${message}` : `${user}${message}`;
    return this._genericRequest(ENDPOINTS.SEND_LOGS, { message: logMessage }, 'post');
  }

  async validateUserType(userType) {
    const response = await this._genericRequest(ENDPOINTS.VALIDATE_CREDENTIALS, { key: userType }, 'post');
    return response && response.status === 200 && response.data.validUser ? response.data : '';
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
