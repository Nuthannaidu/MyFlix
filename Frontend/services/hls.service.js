import Hls from 'hls.js';

class HLSService {
  static loadVideo(videoElement, src, onError) {
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        
        // --- 1. Buffer Settings (Fixes "Spinning" on High Quality) ---
        maxBufferLength: 30,
        maxMaxBufferLength: 60,

        // --- 2. Bandwidth Conservatism (Fixes 3G Stalling) ---
        // Treat 1Mbps connection as if it's only 700kbps (30% safety margin)
        abrBandWidthFactor: 0.7, 
        
        // --- 3. Upgrade Reluctance (Fixes "Seesawing") ---
        // Only upgrade if we have massive extra bandwidth (lazy upgrade)
        abrBandWidthUpFactor: 0.5, 

        // --- 4. Smooth Estimation (Ignores short speed spikes) ---
        abrEwmaDefaultEstimate: 500000,
        abrEwmaFastVoD: 10, 
        abrEwmaSlowVoD: 20, 

        // --- 5. Performance Optimization (Save CPU/Data) ---
        // Don't load 1080p if the video element is only 400px wide
        capLevelToPlayerSize: true 
      });

      hls.loadSource(src);
      hls.attachMedia(videoElement);

      // --- Events ---
      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        const level = hls.levels[data.level];
        if (level) {
          console.log(`Quality switched to: ${level.height}p, Bitrate: ${level.bitrate}`);
        }
      });

      hls.on(Hls.Events.ERROR, function (event, data) {
        // Detect if user is forcing a quality their net can't handle
        if (data.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
          console.warn("Buffer Stalled: Network is too slow for the current quality.");
        }

        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.warn('Network error, trying to recover...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.warn('Media error, recovering...');
              hls.recoverMediaError();
              break;
            default:
              console.error('Fatal error, destroying player.');
              hls.destroy();
              if (onError) onError("Video failed to load.");
              break;
          }
        }
      });

      return hls;
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari Native Fallback
      videoElement.src = src;
      return null;
    }
  }
}

export default HLSService;