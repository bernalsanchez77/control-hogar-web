class Utils {
  supabaseChannels = {};
  isHome(lat, lon) {
      const latCentro = 9.9333;
      const lonCentro = -84.0845;
      const tolerancia = 0.005; // Aproximadamente 5-6 km de margen
  
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
  async getIpApiPosition() {
    try {
      const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
      const data = await response.json();
      return data;
    } catch (err) {
      console.log('Failed to fetch IP geo data:', err);
      return null;
    }
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
  triggerVibrate(length = 100) {
    if (navigator.vibrate) {
      navigator.vibrate([length]);
    }
  }
  getUser(screenSize) {
    if (screenSize === '393x873') {
      return 'Bernal Cel';
    } else if (screenSize === '672x1060') {
      return 'Bernal Pc';
    } else {
      return 'Invitado';
    }
  }
  firstCharToUpperCase(text) {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }
  async getIsConnectedToInternet() {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      // Use a small, reliable file
      await fetch('https://www.google.com/favicon.ico', {
        mode: 'no-cors',
        cache: "no-cache",
        signal: controller.signal,
      });

      clearTimeout(timeout);
      return true;
    } catch (err) {
      return false;
    }
  }
}
export default Utils;
