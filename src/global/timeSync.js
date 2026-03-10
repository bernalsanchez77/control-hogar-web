class TimeSync {
    constructor() {
        this.offset = 0;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        this.initialized = true;

        try {
            // Get the absolute true time from the internet
            const response = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=UTC');
            const data = await response.json();

            const trueServerTime = new Date(data.dateTime).getTime();
            const localDeviceTime = Date.now();

            // Calculate how wrong this device's clock is
            this.offset = trueServerTime - localDeviceTime;
            console.log('Device time synced. Offset is:', this.offset, 'ms.');
        } catch (error) {
            console.error('Failed to sync true time:', error);
            this.offset = 0; // Fallback to device time if offline
        }
    }

    // This guarantees the time is correct AND formatted exactly like Supabase (+00:00)
    getSyncedIsoString() {
        const correctTime = new Date(Date.now() + this.offset);

        // Convert to standard ISO string but replace the "Z" with "+00:00"
        return correctTime.toISOString().replace('Z', '+00:00');
    }
}

const timeSync = new TimeSync();
export default timeSync;
