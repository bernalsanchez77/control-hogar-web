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
            maximumAge: 10000
            }
          );
        });
    }
    getPosition2() {
        return new Promise((resolve, reject) => {
          navigator.geolocation.watchPosition(
            (position) => {
              resolve(position);
              console.log("Ubicación rápida con watchPosition:", position.coords);
              // navigator.geolocation.clearWatch(watchId); // Detiene después de la primera
            },
            (error) => {
              reject(error);
              console.error("Error:", error);
            },
            {
            enableHighAccuracy: false,
            maximumAge: 10000
            }
          );
      });
    }
    getIpApiPosition() {
        return new Promise((resolve, reject) => {
        fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          resolve(data);
          console.log('Ubicación aproximada:', data.latitude, data.longitude);
        })
        .catch(err => {
        reject(err);
          console.error('Error al obtener ubicación por IP:', err);
        });
    });
    }
    async getGeolocationPosition() {
        let inRange = false;
        const position = await this.getPosition3();
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
    async getInRange() {
        let inRange = false;
        const position = await this.getIpApiPosition();
        if (position) {
            const latitude = position.latitude;
            const longitude = position.longitude;
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