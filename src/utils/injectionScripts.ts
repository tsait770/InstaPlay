import type { VoiceCommand } from './commandParser'

export function generateInjectionScript(command: VoiceCommand): string {
  const scripts: Record<VoiceCommand, string> = {
    play: `
      (function() {
        const video = document.querySelector('video');
        if (video) {
          video.play();
          window.ReactNativeWebView?.postMessage(JSON.stringify({ success: true, command: 'play' }));
        } else {
          window.ReactNativeWebView?.postMessage(JSON.stringify({ success: false, error: 'No video element found' }));
        }
      })();
    `,
    pause: `
      (function() {
        const video = document.querySelector('video');
        if (video) {
          video.pause();
          window.ReactNativeWebView?.postMessage(JSON.stringify({ success: true, command: 'pause' }));
        } else {
          window.ReactNativeWebView?.postMessage(JSON.stringify({ success: false, error: 'No video element found' }));
        }
      })();
    `,
    forward10: `
      (function() {
        const video = document.querySelector('video');
        if (video) {
          video.currentTime += 10;
          window.ReactNativeWebView?.postMessage(JSON.stringify({ success: true, command: 'forward10', currentTime: video.currentTime }));
        } else {
          window.ReactNativeWebView?.postMessage(JSON.stringify({ success: false, error: 'No video element found' }));
        }
      })();
    `,
    backward10: `
      (function() {
        const video = document.querySelector('video');
        if (video) {
          video.currentTime -= 10;
          window.ReactNativeWebView?.postMessage(JSON.stringify({ success: true, command: 'backward10', currentTime: video.currentTime }));
        } else {
          window.ReactNativeWebView?.postMessage(JSON.stringify({ success: false, error: 'No video element found' }));
        }
      })();
    `,
    forward30: `
      (function() {
        const video = document.querySelector('video');
        if (video) {
          video.currentTime += 30;
          window.ReactNativeWebView?.postMessage(JSON.stringify({ success: true, command: 'forward30', currentTime: video.currentTime }));
        } else {
          window.ReactNativeWebView?.postMessage(JSON.stringify({ success: false, error: 'No video element found' }));
        }
      })();
    `,
    backward30: `
      (function() {
        const video = document.querySelector('video');
        if (video) {
          video.currentTime -= 30;
          window.ReactNativeWebView?.postMessage(JSON.stringify({ success: true, command: 'backward30', currentTime: video.currentTime }));
        } else {
          window.ReactNativeWebView?.postMessage(JSON.stringify({ success: false, error: 'No video element found' }));
        }
      })();
    `,
    volumeUp: `
      (function() {
        const video = document.querySelector('video');
        if (video) {
          video.volume = Math.min(video.volume + 0.1, 1);
          window.ReactNativeWebView?.postMessage(JSON.stringify({ success: true, command: 'volumeUp', volume: video.volume }));
        } else {
          window.ReactNativeWebView?.postMessage(JSON.stringify({ success: false, error: 'No video element found' }));
        }
      })();
    `,
    volumeDown: `
      (function() {
        const video = document.querySelector('video');
        if (video) {
          video.volume = Math.max(video.volume - 0.1, 0);
          window.ReactNativeWebView?.postMessage(JSON.stringify({ success: true, command: 'volumeDown', volume: video.volume }));
        } else {
          window.ReactNativeWebView?.postMessage(JSON.stringify({ success: false, error: 'No video element found' }));
        }
      })();
    `,
    fullscreen: `
      (function() {
        const video = document.querySelector('video');
        if (video) {
          if (video.requestFullscreen) {
            video.requestFullscreen();
          } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
          } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen();
          } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
          }
          window.ReactNativeWebView?.postMessage(JSON.stringify({ success: true, command: 'fullscreen' }));
        } else {
          window.ReactNativeWebView?.postMessage(JSON.stringify({ success: false, error: 'No video element found' }));
        }
      })();
    `,
    exitFullscreen: `
      (function() {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        window.ReactNativeWebView?.postMessage(JSON.stringify({ success: true, command: 'exitFullscreen' }));
      })();
    `,
    restart: `
      (function() {
        const video = document.querySelector('video');
        if (video) {
          video.currentTime = 0;
          video.play();
          window.ReactNativeWebView?.postMessage(JSON.stringify({ success: true, command: 'restart' }));
        } else {
          window.ReactNativeWebView?.postMessage(JSON.stringify({ success: false, error: 'No video element found' }));
        }
      })();
    `,
    mute: `
      (function() {
        const video = document.querySelector('video');
        if (video) {
          video.muted = true;
          window.ReactNativeWebView?.postMessage(JSON.stringify({ success: true, command: 'mute' }));
        } else {
          window.ReactNativeWebView?.postMessage(JSON.stringify({ success: false, error: 'No video element found' }));
        }
      })();
    `,
    unmute: `
      (function() {
        const video = document.querySelector('video');
        if (video) {
          video.muted = false;
          window.ReactNativeWebView?.postMessage(JSON.stringify({ success: true, command: 'unmute' }));
        } else {
          window.ReactNativeWebView?.postMessage(JSON.stringify({ success: false, error: 'No video element found' }));
        }
      })();
    `,
    speed: `
      (function() {
        const video = document.querySelector('video');
        if (video) {
          const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
          const currentIndex = speeds.indexOf(video.playbackRate);
          const nextIndex = (currentIndex + 1) % speeds.length;
          video.playbackRate = speeds[nextIndex];
          window.ReactNativeWebView?.postMessage(JSON.stringify({ success: true, command: 'speed', playbackRate: video.playbackRate }));
        } else {
          window.ReactNativeWebView?.postMessage(JSON.stringify({ success: false, error: 'No video element found' }));
        }
      })();
    `,
    unknown: `
      window.ReactNativeWebView?.postMessage(JSON.stringify({ success: false, error: 'Unknown command' }));
    `,
  }

  return scripts[command] || scripts.unknown
}
