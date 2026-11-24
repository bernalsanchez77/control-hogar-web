import request from '../../global/globalRequests';
import timeSync from '../../utils/timeSync';
import requests from './initRequests';

jest.mock('../../global/globalRequests', () => ({
  __esModule: true,
  default: {
    _genericRequest: jest.fn(),
  },
}));

jest.mock('../../utils/timeSync', () => ({
  __esModule: true,
  default: {
    getSyncedIsoString: jest.fn(),
  },
}));

const SYNCED_DATE = '2026-11-20T00:00:00.000Z';

describe('initRequests.upsertTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    request._genericRequest.mockResolvedValue('transport-result');
    timeSync.getSyncedIsoString.mockReturnValue(SYNCED_DATE);
  });

  it('delegates through the imported request singleton with the expected arguments', async () => {
    const params = { table: 'youtubeChannels', id: 'abc' };

    const result = await requests.upsertTable(params);

    expect(request._genericRequest).toHaveBeenCalledTimes(1);
    expect(request._genericRequest).toHaveBeenCalledWith(
      'upsertTableInSupabase',
      params,
      'patch',
      'json',
    );
    expect(result).toBe('transport-result');
  });

  it('injects the synced date when params.date is undefined', async () => {
    const params = { table: 'youtubeChannels' };

    await requests.upsertTable(params);

    expect(timeSync.getSyncedIsoString).toHaveBeenCalledTimes(1);
    expect(request._genericRequest).toHaveBeenCalledWith(
      'upsertTableInSupabase',
      { table: 'youtubeChannels', date: SYNCED_DATE },
      'patch',
      'json',
    );
  });

  it('deletes the date key when params.date is null', async () => {
    const params = { table: 'youtubeChannels', date: null };

    await requests.upsertTable(params);

    expect(timeSync.getSyncedIsoString).not.toHaveBeenCalled();
    expect(request._genericRequest).toHaveBeenCalledWith(
      'upsertTableInSupabase',
      { table: 'youtubeChannels' },
      'patch',
      'json',
    );
  });

  it.each(['', 0, false])('preserves a provided date %p without calling the clock', async (date) => {
    const params = { table: 'youtubeChannels', date };

    await requests.upsertTable(params);

    expect(timeSync.getSyncedIsoString).not.toHaveBeenCalled();
    expect(request._genericRequest).toHaveBeenCalledWith(
      'upsertTableInSupabase',
      { table: 'youtubeChannels', date },
      'patch',
      'json',
    );
  });

  it('propagates a transport rejection unchanged', async () => {
    const failure = new Error('transport failed');
    request._genericRequest.mockRejectedValueOnce(failure);

    await expect(requests.upsertTable({ table: 'youtubeChannels' })).rejects.toBe(failure);
  });
});
