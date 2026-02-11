import Hls from 'hls.js';

class HLSService {
  static loadVideo(videoElement, src, onError) {
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        abrEwmaDefaultEstimate: 500000,
        maxBufferLength: 10,
        maxMaxBufferLength: 20,
        abrBandWidthFactor: 0.8,
        abrBandWidthUpFactor: 0.5,
        testBandwidth: true,
      });

      hls.loadSource(src);
      hls.attachMedia(videoElement);

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        const level = hls.levels[data.level];
        console.log(`Quality switched to: ${level.height}p`);
      });

      hls.on(Hls.Events.ERROR, function (event, data) {
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
              hls.destroy();
              if (onError) onError("Video failed to load.");
              break;
          }
        }
      });

      return hls;
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = src;
      return null;
    }
  }
}

export default HLSService;
