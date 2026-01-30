class Utils {
  supabaseChannels = {};
  longClickTimeout = null;
  longClick = false;
  touchMoved = false;
  touchStartY = 0;
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
    inRange = false;
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
    inRange = false;
    return inRange;
  }
  triggerVibrate(length = 100) {
    if (window.cordova && navigator.vibrate) {
      navigator.vibrate([length]);
    } else {
      console.log('No se puede vibrar');
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
  timeToMs(timeString) {
    const parts = timeString.split(':');
    const numParts = parts.length;
    const MS_IN_SECOND = 1000;
    const MS_IN_MINUTE = 60 * MS_IN_SECOND; // 60,000
    const MS_IN_HOUR = 60 * MS_IN_MINUTE;   // 3,600,000
    let totalMilliseconds = 0;
    if (numParts === 3) {
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      const seconds = parseInt(parts[2], 10);
      totalMilliseconds = (hours * MS_IN_HOUR) + (minutes * MS_IN_MINUTE) + (seconds * MS_IN_SECOND);
    } else if (numParts === 2) {
      const minutes = parseInt(parts[0], 10);
      const seconds = parseInt(parts[1], 10);
      totalMilliseconds = (minutes * MS_IN_MINUTE) + (seconds * MS_IN_SECOND);
    }
    return totalMilliseconds;
  }
  msToTime(ms, includeHours = false) {
    const MS_IN_SECOND = 1000;
    const MS_IN_MINUTE = 60 * MS_IN_SECOND;
    const MS_IN_HOUR = 60 * MS_IN_MINUTE;
    const hours = Math.floor(ms / MS_IN_HOUR);
    const minutes = Math.floor((ms % MS_IN_HOUR) / MS_IN_MINUTE);
    const seconds = Math.floor((ms % MS_IN_MINUTE) / MS_IN_SECOND);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    if (hours > 0 || includeHours) {
      const formattedHours = String(hours).padStart(2, '0');
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
      const totalMinutes = Math.floor(ms / MS_IN_MINUTE);
      const finalMinutes = String(totalMinutes).padStart(2, '0');
      return `${finalMinutes}:${formattedSeconds}`;
    }
  }
  checkVideoEnd(position, video) {
    let normalizedPercentage = 0;
    if (video && video.id) {
      let currentVideoDuration = 0;
      if (video.duration) {
        currentVideoDuration = utils.timeToMs(video.duration);
      }
      console.log('position:', position, 'duration:', currentVideoDuration);
      const timeLeft = currentVideoDuration - position;
      const percentage = (position * 100) / currentVideoDuration;
      normalizedPercentage = Math.round(Math.min(100, Math.max(0, (percentage))));
      console.log(normalizedPercentage + '%');
      if (timeLeft && timeLeft < 10000) {
        console.log('terminando');
        return { normalizedPercentage, end: true };
      }
    }
    return { normalizedPercentage, end: false };
  }
  onTouchStart(value, e, onShortClick) {
    e.preventDefault();
    this.touchStartY = e.touches[0].clientY;
    this.touchMoved = false;
    this.longClickTimeout = setTimeout(() => {
      this.longClick = true;
    }, 500);
    onShortClick(false, value);
  }
  onTouchEnd(value, e, onShortClick, onLongClick) {
    e.preventDefault();
    clearTimeout(this.longClickTimeout);
    if (!this.touchMoved) {
      if (this.longClick) {
        if (onLongClick) {
          onLongClick(value);
        }
      } else {
        onShortClick(true, value);
      }
    }
    this.longClick = false;
  }
  onTouchMove(e) {
    const deltaY = Math.abs(e.touches[0].clientY - this.touchStartY);
    if (deltaY > 10) {
      this.touchMoved = true;
    }
  }
  parseYoutubeDurationToSeconds(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (parseInt(match[1]) || 0);
    const minutes = (parseInt(match[2]) || 0);
    const seconds = (parseInt(match[3]) || 0);
    return (hours * 3600) + (minutes * 60) + seconds;
  }
  formatYoutubeDuration(isoDuration) {
    if (!isoDuration) return "00:00:00";
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (parseInt(match[1]) || 0);
    const minutes = (parseInt(match[2]) || 0);
    const seconds = (parseInt(match[3]) || 0);
    const pad = (num) => num.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
}
const utils = new Utils();
export default utils;
