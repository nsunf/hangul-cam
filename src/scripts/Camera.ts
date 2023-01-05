export default class Camera {
  videoEl: HTMLVideoElement;
  loaded: boolean;
  constructor(videoHeigth: number) {
    this.videoEl = document.createElement('video');
    this.loaded = false;

    const mediaStreamConstraints: MediaStreamConstraints = {
      audio: false,
      video: {
        facingMode: 'user',
        width: Math.floor(videoHeigth/9 * 16),
        height: videoHeigth
      }
    }
    navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
      .then((stream: MediaStream) => {
        stream.getVideoTracks().forEach(videoTrack => {
          console.log(videoTrack.getSettings())
        })
        this.videoEl.srcObject = stream;
        this.videoEl.play();
        this.videoEl.onloadedmetadata = () => this.loaded = true;
      }).catch(err => {
        console.log(err);
      })
  }
}