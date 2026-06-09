export const createUserSlice = (set, get) => ({
    userTypeSt: '',
    userNameSt: '',
    userDevicesSt: '',
    userNameDevicesSt: '',
    screenSelectedSt: '',
    peersSt: [],
    skipLeaderSt: true,

    setUserTypeSt: (v) => set({ userTypeSt: v }),
    setUserNameSt: (v) => set({
        userNameSt: v,
        userNameDevicesSt: v && get().userDevicesSt ? `${v}-${get().userDevicesSt}` : ''
    }),
    setUserDevicesSt: (v) => set({
        userDevicesSt: v,
        userNameDevicesSt: get().userNameSt && v ? `${get().userNameSt}-${v}` : ''
    }),
    setSkipLeaderSt: (v) => set({ skipLeaderSt: v }),
    setScreenSelectedSt: (v) => set({ screenSelectedSt: v }),
    setPeersSt: (v) => set({ peersSt: v }),
});
