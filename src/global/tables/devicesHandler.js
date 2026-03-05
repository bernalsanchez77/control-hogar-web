import requests from '../requests';

export const handleDevicesChange = async (oldItem, newItem, eventType, userName, leader) => {
    if (userName === leader) {
        requests.sendIfttt({ device: newItem.id, key: 'state', value: newItem.state });
    }
};
