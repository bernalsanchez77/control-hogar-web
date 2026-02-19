import { useCallback } from 'react';
import { store } from '../../../store/store';
import supabaseChannels from '../../../global/supabase/supabase-channels';
import requests from '../../../global/requests';

export function useSupabaseInit() {
    const setSupabaseTimeoutSt = store(v => v.supabaseSetTimeoutSt);
    const updateTablesSt = store((v) => v.updateTablesSt);
    const setTableSt = store((v) => v.setTableSt);

    const subscribeToSupabaseChannel = useCallback(async (tableName, callback) => {
        let response = '';
        await supabaseChannels.subscribeToSupabaseChannel(tableName, async (itemName, newItem) => {
            updateTablesSt(tableName + 'St', newItem);
            if (callback) {
                await callback(newItem);
            }
        }, true).then((res) => {
            if (res.success) {
                response = 'SUBSCRIBED';
                setSupabaseTimeoutSt(false);
            } else {
                switch (res.msg) {
                    case 'TIMED_OUT':
                        response = res.msg;
                        setSupabaseTimeoutSt(true);
                        break;
                    case 'CHANNEL_ERROR':
                    case 'CLOSED':
                    default:
                        response = res.msg;
                        setSupabaseTimeoutSt(false);
                }
            }
        }).catch((res) => {
            response = res.msg;
        });
        return response;
    }, [setSupabaseTimeoutSt, updateTablesSt]);

    const setData = useCallback(async (tableName, data, callback) => {
        let subscriptionResponse = '';
        let table = await requests.getTable(tableName);
        if (table && table.status === 200 && table.data) {
            setTableSt(tableName + 'St', table.data);
            const tableChannel = supabaseChannels.getSupabaseChannelState(tableName);
            if (tableChannel?.channel) {
                const state = tableChannel.channel.state;
                if (state !== 'joined') {
                    if (tableChannel.subscribed) {
                        await supabaseChannels.unsubscribeFromSupabaseChannel(tableName);
                    }
                    subscriptionResponse = await subscribeToSupabaseChannel(tableName, callback);
                }
            } else {
                subscriptionResponse = await subscribeToSupabaseChannel(tableName, callback);
            }
            return data ? table.data : { table, subscriptionResponse };
        } else {
            return { table: null };
        }
    }, [subscribeToSupabaseChannel, setTableSt]);

    return {
        setData,
        subscribeToSupabaseChannel
    };
}
