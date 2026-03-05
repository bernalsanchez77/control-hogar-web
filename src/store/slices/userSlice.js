export const createUserSlice = (set, get) => ({
    userTypeSt: '',
    userNameSt: '',
    userDeviceSt: '',
    userNameDeviceSt: '',
    screenSelectedSt: '',
    peersSt: [],

    setUserTypeSt: (v) => set({ userTypeSt: v }),
    setUserNameSt: (v) => set({
        userNameSt: v,
        userNameDeviceSt: v && get().userDeviceSt ? `${v}-${get().userDeviceSt}` : ''
    }),
    setUserDeviceSt: (v) => set({
        userDeviceSt: v,
        userNameDeviceSt: get().userNameSt && v ? `${get().userNameSt}-${v}` : ''
    }),
    setScreenSelectedSt: (v) => set({ screenSelectedSt: v }),
    setPeersSt: (v) => set({ peersSt: v }),
});
