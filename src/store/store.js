import { create } from "zustand";
export const store = create((set) => ({
  // --- Global states ---
  sendEnabledSt: true,
  simulatePlayStateSt: false,
  isLoadingSt: false,
  themeSt: 'dark',
  isInForegroundSt: true,
  userTypeSt: '',
  userNameSt: '',
  userDeviceSt: '',
  screenSelectedSt: '',
  isConnectedToInternetSt: true,
  wifiNameSt: '',
  networkTypeSt: '',
  supabaseTimeoutSt: false,
  rokuSearchModeSt: 'default',
  screensSt: [],
  cableChannelsSt: [],
  youtubeSearchVideosSt: [],
  youtubeChannelsLizSt: [],
  youtubeChannelsImagesSt: [],
  youtubeVideosLizSt: [],
  rokuAppsSt: [],
  hdmiSalaSt: [],
  devicesSt: [],
  selectionsSt: [],
  isPcSt: false,
  isAppSt: false,
  peersSt: [],
  lizEnabledSt: false,
  viewSt: { selected: '', cable: { channels: { category: [] } }, roku: { apps: { selected: '', youtube: { mode: '', channel: '' } } }, devices: { device: '' } },

  // --- Actions ---
  setSendEnabledSt: (v) => set({ sendEnabledSt: v }),
  setSimulatePlayStateSt: (v) => set({ simulatePlayStateSt: v }),
  setIsLoadingSt: (v) => set({ isLoadingSt: v }),
  setThemeSt: (v) => set({ themeSt: v }),
  setIsInForegroundSt: (v) => set({ isInForegroundSt: v }),
  setUserTypeSt: (v) => set({ userTypeSt: v }),
  setUserNameSt: (v) => set({ userNameSt: v }),
  setUserDeviceSt: (v) => set({ userDeviceSt: v }),
  setScreenSelectedSt: (v) => set({ screenSelectedSt: v }),
  setIsConnectedToInternetSt: (v) => set({ isConnectedToInternetSt: v }),
  setWifiNameSt: (v) => set({ wifiNameSt: v }),
  setNetworkTypeSt: (v) => set({ networkTypeSt: v }),
  supabaseSetTimeoutSt: (v) => set({ supabaseTimeoutSt: v }),
  setRokuSearchModeSt: (v) => set({ rokuSearchModeSt: v }),
  setScreensSt: (v) => set({ screensSt: v }),
  setCableChannelsSt: (v) => set({ cableChannelsSt: v }),
  setYoutubeSearchVideosSt: (v) => set({ youtubeSearchVideosSt: v }),
  setYoutubeChannelsLizSt: (v) => set({ youtubeChannelsLizSt: v }),
  setYoutubeChannelsImagesSt: (v) => set({ youtubeChannelsImagesSt: v }),
  setYoutubeVideosLizSt: (v) => set({ youtubeVideosLizSt: v }),
  setRokuAppsSt: (v) => set({ rokuAppsSt: v }),
  setHdmiSalaSt: (v) => set({ hdmiSalaSt: v }),
  setDevicesSt: (v) => set({ devicesSt: v }),
  setIsPcSt: (v) => set({ isPcSt: v }),
  setIsAppSt: (v) => set({ isAppSt: v }),
  setViewSt: (v) => set({ viewSt: v }),
  setLizEnabledSt: (v) => set({ lizEnabledSt: v }),
  updateTablesSt: (tableName, newItem) => {
    set((state) => {
      const currentList = state[tableName];
      const idKey = tableName === 'selectionsSt' ? 'table' : 'id';
      const targetId = newItem[idKey];
      const exists = currentList.some((item) => item[idKey] === targetId);
      let updatedList;
      if (exists) {
        updatedList = currentList.map((item) =>
          item[idKey] === targetId ? newItem : item
        );
      } else {
        updatedList = [...currentList, newItem];
      }
      return { [tableName]: updatedList };
    });
  },
  setTableSt: (tableName, newTable) => set({ [tableName]: newTable }),
  setPeersSt: (v) => set({ peersSt: v }),
  setSelectionsSt: (v) => set({ selectionsSt: v })
}));