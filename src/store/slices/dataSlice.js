export const createDataSlice = (set) => ({
    supabaseTimeoutSt: false,
    rokuSearchModeSt: 'default',
    screensSt: [],
    cableChannelsSt: [],
    youtubeSearchVideosSt: [],
    youtubeChannelsSt: [],
    youtubeChannelsImagesSt: [],
    youtubeVideosSt: [],
    rokuAppsSt: [],
    hdmiSalaSt: [],
    devicesSt: [],
    selectionsSt: [],

    supabaseSetTimeoutSt: (v) => set({ supabaseTimeoutSt: v }),
    setRokuSearchModeSt: (v) => set({ rokuSearchModeSt: v }),
    setScreensSt: (v) => set({ screensSt: v }),
    setCableChannelsSt: (v) => set({ cableChannelsSt: v }),
    setYoutubeSearchVideosSt: (v) => set({ youtubeSearchVideosSt: v }),
    setYoutubeChannelsSt: (v) => set({ youtubeChannelsSt: v }),
    setYoutubeChannelsImagesSt: (v) => set({ youtubeChannelsImagesSt: v }),
    setYoutubeVideosSt: (v) => set({ youtubeVideosSt: v }),
    setRokuAppsSt: (v) => set({ rokuAppsSt: v }),
    setHdmiSalaSt: (v) => set({ hdmiSalaSt: v }),
    setDevicesSt: (v) => set({ devicesSt: v }),
    setSelectionsSt: (v) => set({ selectionsSt: v }),

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
});
