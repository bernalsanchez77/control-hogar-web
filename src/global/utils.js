class Utils {
    isHome(lat, lon) {
        const latCentro = 9.9622781;
        const lonCentro = -84.0783371;
        const tolerancia = 0.05; // Aproximadamente 5-6 km de margen
    
        return (
        lat >= latCentro - tolerancia &&
        lat <= latCentro + tolerancia &&
        lon >= lonCentro - tolerancia &&
        lon <= lonCentro + tolerancia
        );
    };
    getPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
            (position) => resolve(position),
            (error) => reject(error),
            {
              enableHighAccuracy: false,
              maximumAge: 10000,
              maximumAge: 0
            });
        });
    }
    async getGeolocationPosition() {
        let inRange = false;
        const position = await this.getPosition();
        if (position) {
            const { latitude, longitude } = position.coords;
            if (this.isHome(latitude, longitude)) {
                inRange = true;
            } else {
                inRange = false;
            }
            return inRange;
        };
        inRange =false;
        return inRange;
    }
}
export default Utils;