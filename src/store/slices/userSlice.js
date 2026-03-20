export const createUserSlice = (set, get) => ({
    userTypeSt: '',
    userNameSt: '',
    userDevices2St: '',
    userNameDevicesSt: '',
    screenSelectedSt: '',
    peersSt: [],

    setUserTypeSt: (v) => set({ userTypeSt: v }),
    setUserNameSt: (v) => set({
        userNameSt: v,
        userNameDevicesSt: v && get().userDevices2St ? `${v}-${get().userDevices2St}` : ''
    }),
    setUserDevices2St: (v) => set({
        userDevices2St: v,
        userNameDevicesSt: get().userNameSt && v ? `${get().userNameSt}-${v}` : ''
    }),
    setScreenSelectedSt: (v) => set({ screenSelectedSt: v }),
    setPeersSt: (v) => set({ peersSt: v }),
});
