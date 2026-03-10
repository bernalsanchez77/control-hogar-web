import requests from '../requests';

export const handleDevicesChange = async (oldItem, newItem, eventType, userNameDevice, leader) => {
    if (userNameDevice === leader) {
        requests.sendIfttt({ device: newItem.id, key: 'state', value: newItem.state });
        if (newItem.color !== oldItem.color) {
            requests.sendIfttt({ device: newItem.id, key: 'color', value: newItem.color });
        }
    }
};
