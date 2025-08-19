import supabase from './supabase-client';
class Utils {
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
    getIpApiPosition() {
      return new Promise((resolve, reject) => {
        fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(res => res.json())
        .then(data => {resolve(data);}).catch(err => {reject(err);});
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

    subscribeToSupabaseChannel(tableName, supabaseChannelsRef, callback) {
      const select = tableName !== 'devices' && tableName !== 'screens';
      const channel = this.getSupabaseChannel(tableName, supabaseChannelsRef);
      if (channel?.socket.state !== 'joined') {
        channel.on(
          'postgres_changes',
          {event: '*', schema: 'public', table: tableName},
          async (change) => {
            console.log(change.table, ' changed');
            const name = 'set' + change.table.charAt(0).toUpperCase() + change.table.slice(1);
            if (select) {
              if (change.new.state === 'selected') {
                if (callback) {
                  callback(name, change.new);
                }
              }
            } else {
              if (callback) {
                callback(name, change.new);
              }
            }
          }
        ).subscribe(status => {
          console.log(tableName, ' status is: ', status);
          if (status === 'SUBSCRIBED') {
            console.log('Subscribed to ', tableName);
          }
        });
      }
    }

    getSupabaseChannel(name, supabaseChannelsRef) {
      if (!supabaseChannelsRef.current[name]) {
        console.log(`Creating channel: ${name}`);
        supabaseChannelsRef.current[name] = supabase.channel(name);
      }
      return supabaseChannelsRef.current[name];
    }

}
export default Utils;
