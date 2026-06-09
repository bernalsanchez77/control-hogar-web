import requests from '../requests';

const external = async (oldItem, newItem, eventType) => {
    requests.sendIfttt({ device: newItem.id, key: 'state', value: newItem.state });
    if (newItem.color !== oldItem.color) {
        requests.sendIfttt({ device: newItem.id, key: 'color', value: newItem.color });
    }
};

const internal = (oldItem, newItem, eventType) => {

};

const handleDevices = {
    external,
    internal
};

export default handleDevices;
