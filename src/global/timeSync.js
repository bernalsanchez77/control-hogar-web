class TimeSync {
    constructor() {
        this.offset = 0;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        this.initialized = true;

        try {
            // Get the absolute true time for Costa Rica
            const response = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=America/Costa_Rica');
            const data = await response.json();

            // The API returns dateTime without timezone, so we explicitly append -06:00 for Costa Rica
            // to ensure the browser converts it to the exact correct absolute Unix timestamp.
            const trueServerTime = new Date(data.dateTime + '-06:00').getTime();
            const localDeviceTime = Date.now();

            // Calculate how wrong this device's clock is in milliseconds
            this.offset = trueServerTime - localDeviceTime;
            console.log('Device time synced to Costa Rica. Offset is:', this.offset, 'ms.');
        } catch (error) {
            console.error('Failed to sync true time:', error);
            this.offset = 0; // Fallback to device time if offline
        }
    }

    // This guarantees the time is correct AND formatted exactly for Costa Rica (-06:00)
    getSyncedIsoString() {
        const correctTime = new Date(Date.now() + this.offset);

        // Costa Rica is UTC-06:00
        const costaRicaOffsetMs = -6 * 60 * 60 * 1000;

        // Shift time by -6 hours so the UTC string components match Costa Rica's local wall-clock time
        const crTime = new Date(correctTime.getTime() + costaRicaOffsetMs);

        // Convert to ISO string, strip the "Z", and append the accurate Costa Rica offset
        return crTime.toISOString().replace('Z', '-06:00');
    }
}

const timeSync = new TimeSync();
export default timeSync;
