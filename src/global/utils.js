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
    getGeolocationPosition() {
        let inRange = false;
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                if (this.isHome(latitude, longitude)) {
                    inRange = true;
                    console.log('in range');
                } else {
                    inRange = false;
                    console.log('not in range');
                }
            },
            (error) => {
            console.error('Error al obtener ubicación:', error);
            inRange =false;
            }
        );
        return inRange;
    }
}
export default Utils;