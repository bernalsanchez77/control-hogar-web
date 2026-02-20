export const createUserSlice = (set) => ({
    userTypeSt: '',
    userNameSt: '',
    userDeviceSt: '',
    screenSelectedSt: '',
    peersSt: [],

    setUserTypeSt: (v) => set({ userTypeSt: v }),
    setUserNameSt: (v) => set({ userNameSt: v }),
    setUserDeviceSt: (v) => set({ userDeviceSt: v }),
    setScreenSelectedSt: (v) => set({ screenSelectedSt: v }),
    setPeersSt: (v) => set({ peersSt: v }),
});
