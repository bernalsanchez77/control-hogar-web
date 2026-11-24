import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { store } from '../../store/store';
import requests from './runtimeRequests';

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock('../../global/globalRequests', () => ({
  __esModule: true,
  default: {
    cordovaApiRequest: jest.fn(),
  },
}));

jest.mock('../../store/store', () => ({
  store: {
    getState: jest.fn(() => ({ sendEnabledSt: true })),
  },
}));

const XML = '<response>Roku</response>';
const DIRECT_URL = 'http://192.168.86.174:8060/';
const PROXY_URL = '/roku/';

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  store.getState.mockReturnValue({ sendEnabledSt: true });
  axios.get.mockResolvedValue({ status: 200, data: XML });
  axios.post.mockResolvedValue({ status: 200 });
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
  delete window.cordova;
});

describe('runtimeRequests source', () => {
  it('declares each Roku base URL only once', () => {
    const source = fs.readFileSync(path.resolve(__dirname, 'runtimeRequests.js'), 'utf8');

    expect(source.split(DIRECT_URL).length - 1).toBe(1);
    expect(source.split(PROXY_URL).length - 1).toBe(1);
  });
});

describe('runtimeRequests.getRokuData', () => {
  it('uses the direct IP from ROKU_CONFIG on Cordova', async () => {
    const sendRequest = jest.fn((url, options, onSuccess) => onSuccess({ status: 200, data: XML }));
    window.cordova = { plugin: { http: { sendRequest } } };

    const result = await requests.getRokuData('active-app');

    expect(sendRequest).toHaveBeenCalledWith(
      `${DIRECT_URL}query/active-app`,
      { method: 'get', headers: {}, params: {} },
      expect.any(Function),
      expect.any(Function),
    );
    expect(result).toEqual({ status: 200, data: { response: 'Roku' } });
  });

  it('uses the proxy path from ROKU_CONFIG.IP_PC in the browser', async () => {
    const result = await requests.getRokuData('active-app');

    expect(axios.get).toHaveBeenCalledWith(`${PROXY_URL}query/active-app`);
    expect(result).toEqual({ status: 200, data: { response: 'Roku' } });
  });

  it('uses axios when Cordova is present without the advanced-http plugin', async () => {
    window.cordova = {};

    await requests.getRokuData('active-app');

    expect(axios.get).toHaveBeenCalledWith(`${PROXY_URL}query/active-app`);
  });

  it('returns null when the request rejects', async () => {
    axios.get.mockRejectedValueOnce(new Error('network down'));

    await expect(requests.getRokuData('active-app')).resolves.toBeNull();
  });

  it('returns null when the request times out at 2000 ms', async () => {
    axios.get.mockReturnValueOnce(new Promise(() => {}));

    const pending = requests.getRokuData('active-app');
    jest.advanceTimersByTime(2000);

    await expect(pending).resolves.toBeNull();
  });
});

describe('runtimeRequests.fetchRoku', () => {
  it('constructs the unchanged direct-IP URL on Cordova', async () => {
    const sendRequest = jest.fn((url, options, onSuccess) => onSuccess({ status: 200 }));
    window.cordova = { plugin: { http: { sendRequest } } };

    await requests.fetchRoku({ key: 'keypress', value: 'Home' });

    expect(sendRequest).toHaveBeenCalledWith(
      `${DIRECT_URL}keypress/Home`,
      expect.objectContaining({ method: 'post' }),
      expect.any(Function),
      expect.any(Function),
    );
  });

  it('constructs the unchanged proxy URL in the browser', async () => {
    await requests.fetchRoku({ key: 'keypress', value: 'Home' });

    expect(axios.post).toHaveBeenCalledWith(
      `${PROXY_URL}keypress/Home`,
      {},
      expect.objectContaining({ headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }),
    );
  });
});
