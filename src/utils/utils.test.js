import utils from './utils';

const HOME_LAT = 9.9333;
const HOME_LON = -84.0845;

const setGeolocation = (getCurrentPosition) => {
  Object.defineProperty(navigator, 'geolocation', {
    configurable: true,
    value: { getCurrentPosition },
  });
};

const positionAt = (latitude, longitude) => ({ coords: { latitude, longitude } });

describe('utils.getGeolocationPosition', () => {
  afterEach(() => {
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: undefined,
    });
  });

  it('returns true when the position is inside the home area', async () => {
    setGeolocation(jest.fn((success) => success(positionAt(HOME_LAT, HOME_LON))));

    await expect(utils.getGeolocationPosition()).resolves.toBe(true);
  });

  it('returns false when the position is outside the home area', async () => {
    setGeolocation(jest.fn((success) => success(positionAt(10.5, -84.5))));

    await expect(utils.getGeolocationPosition()).resolves.toBe(false);
  });

  it('returns false when the success callback provides a falsy position', async () => {
    setGeolocation(jest.fn((success) => success(null)));

    await expect(utils.getGeolocationPosition()).resolves.toBe(false);
  });

  it('returns false when the geolocation error callback fires', async () => {
    setGeolocation(jest.fn((success, error) => error(new Error('permission denied'))));

    await expect(utils.getGeolocationPosition()).resolves.toBe(false);
  });

  it('returns false when geolocation is unavailable', async () => {
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: undefined,
    });

    await expect(utils.getGeolocationPosition()).resolves.toBe(false);
  });
});
