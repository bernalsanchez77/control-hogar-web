import timeSync from '../../utils/timeSync';
import request from '../../global/globalRequests';

class Requests {
  async updateTable(params) {
    return request.updateTable(params);
  }

  async upsertTable(params) {
    if (params.date === undefined) {
      params.date = timeSync.getSyncedIsoString();
    }
    if (params.date === null) {
      delete params.date;
    }
    return requests._genericRequest('upsertTableInSupabase', params, 'patch', 'json');
  }

  async getTable(table) {
    return request._genericRequest('getTableFromSupabase', { table }, 'get');
  }

  async searchYoutube(text) {
    const res = await request._genericRequest('getVideosFromYoutube', { q: text }, 'get');
    return res && res.status === 200 ? res.data.items : null;
  }

  async sendLogs(message, user) {
    const logMessage = window.cordova ? `${window.device.model} ${message}` : `${user}${message}`;
    return request._genericRequest('sendLogs', { message: logMessage }, 'post');
  }

  async validateUserType(userType) {
    const response = await request._genericRequest('validateCredentials', { key: userType }, 'post');
    return response && response.status === 200 && response.data.validUser ? response.data : '';
  }

  async updateSelections(params) {
    return request.updateSelections(params);
  }
}

const requests = new Requests(window.location.hostname === 'localhost' && !window.cordova);
export default requests;
